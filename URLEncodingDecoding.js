import { Buffer } from 'buffer';
// npm install--save buffer

const EID = Buffer.from(id, 'base64').toString('binary');
//1

const EID = Buffer.from(`${product.id}`, 'binary').toString('base64');
//MN==c:\Users\admin\PC\Documents\bookmarks_12_30_23.html