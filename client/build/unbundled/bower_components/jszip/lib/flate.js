"use strict";function FlateWorker(e,r){GenericWorker.call(this,"FlateWorker/"+e),this._pako=new pako[e]({raw:!0,level:r.level||-1}),this.meta={};var t=this;this._pako.onData=function(e){t.push({data:e,meta:t.meta})}}var USE_TYPEDARRAY="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Uint32Array,pako=require("pako"),utils=require("./utils"),GenericWorker=require("./stream/GenericWorker"),ARRAY_TYPE=USE_TYPEDARRAY?"uint8array":"array";exports.magic="\b\0",utils.inherits(FlateWorker,GenericWorker),FlateWorker.prototype.processChunk=function(e){this.meta=e.meta,this._pako.push(utils.transformTo(ARRAY_TYPE,e.data),!1)},FlateWorker.prototype.flush=function(){GenericWorker.prototype.flush.call(this),this._pako.push([],!0)},FlateWorker.prototype.cleanUp=function(){GenericWorker.prototype.cleanUp.call(this),this._pako=null},exports.compressWorker=function(e){return new FlateWorker("Deflate",e)},exports.uncompressWorker=function(){return new FlateWorker("Inflate",{})};