'use strict';

const Hapi = require('hapi');
const FS = require('fs');
const PATH = require('path');
const constants = {
    DIRECTORY: 'directory',
    FILE: 'file'
}


function safeReadDirSync (path) {
    let dirData = {};
    try {
        dirData = FS.readdirSync(path);
    } catch(ex) {
        if (ex.code == "EACCES")
        //User does not have permissions, ignore directory
            return null;
        else throw ex;
    }
    return dirData;
}

function directoryTree (path, options, onEachFile, level = 0) {
    const name = PATH.basename(path);
    const item = { path, name };
    let stats;
    
    try { stats = FS.statSync(path); }
    catch (e) { return null; }
    
    // Skip if it matches the exclude regex
    if (options && options.exclude && options.exclude.test(path))
        return null;
    
    if (stats.isFile()) {
        
        const ext = PATH.extname(path).toLowerCase();
        
        // Skip if it does not match the extension regex
        if (options && options.extensions && !options.extensions.test(ext))
            return null;
        
        item.size = stats.size;  // File size in bytes
        item.extension = ext;
        item.type = constants.FILE;
        if (onEachFile) {
            onEachFile(item, PATH);
        }
    }
    else if (stats.isDirectory()) {
        let dirData = safeReadDirSync(path);
        if (dirData === null) return null;
        
        if (!level) {
            level++;
            item.children = dirData
            .map(child => directoryTree(PATH.join(path, child), options, onEachFile, level))
            .filter(e => !!e);
            //item.size = item.children.reduce((prev, cur) => prev + cur.size, 0);
        }

        
        item.type = constants.DIRECTORY;
    } else {
        return null; // Or set item.size = 0 for devices, FIFO and sockets ?
    }
    return item;
}





// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 8000
});

// Add the route
server.route([{
    method: 'GET',
    path:'/path/{path*}',
    handler: function (request, reply) {
        const tree = directoryTree('/' + request.params.path);
        return reply(tree);
    }
},{
    method: 'POST',
    path:'/path/{path*}',
    handler: function (request, reply) {
    
        let initialPath = request.params.path;
        let pathToUpdate = initialPath.split('/').slice(0,-1).join('/');
        let payload = JSON.parse(request.payload);
        
        console.log(payload.action);
        
        switch (payload.action) {
            case 'update':
                let newFileName = payload.fileName ? payload.fileName : false;
                FS.renameSync(initialPath, pathToUpdate + '/' + newFileName);
                break;
            case 'create':
                if (!FS.existsSync(initialPath)) {
                    FS.mkdirSync(initialPath);
                }
                break;
            case 'delete':
    
                let deleteFolderRecursive = function(path) {
                    if( FS.existsSync(path) ) {
                        FS.readdirSync(path).forEach(function(file, index){
                            let curPath = path + "/" + file;
                            if(FS.lstatSync(curPath).isDirectory()) { // recurse
                                deleteFolderRecursive(curPath);
                            } else { // delete file
                                FS.unlinkSync(curPath);
                            }
                        });
                        FS.rmdirSync(path);
                    }
                };
    
                if(FS.lstatSync(initialPath).isDirectory()) { // recurse
                    deleteFolderRecursive(initialPath);
                } else { // delete file
                    FS.unlinkSync(initialPath);
                }
                
                break;
        }
        
        
        const tree = directoryTree('/' + pathToUpdate);
        console.log(tree);
        return reply(tree);
    }
},{
    method: 'OPTIONS',
    path:'/path/{path*}',
    handler: function (request, reply) {
        return reply('ok');
    }
}]);

server.register({
    register: require('hapi-cors'),
    options: {
        origins: ['*'],
        methods: ['POST, PUT, OPTIONS', 'GET'],
    }
}, function(err){
    server.start(function(){
        console.log(server.info.uri);
    });
});

// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});