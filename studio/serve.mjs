import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css'};
http.createServer((q,r)=>{
  let f=path.resolve('.'+decodeURIComponent(q.url.split('?')[0]));
  if(q.url==='/') f=path.resolve('studio.html');
  fs.readFile(f,(e,d)=> e?(r.writeHead(404),r.end('404'))
    :(r.writeHead(200,{'content-type':types[path.extname(f)]||'application/octet-stream'}),r.end(d)));
}).listen(5180,()=>console.log('http://localhost:5180'));
