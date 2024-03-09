!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("lib0/observable.js"),require("blueimp-md5")):"function"==typeof define&&define.amd?define(["exports","lib0/observable.js","blueimp-md5"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).LWWMap={},e.observable_js,e.md5)}(this,(function(e,t,a){"use strict";function s(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var r=s(a);const i=3e3;class l extends t.Observable{constructor(e,t=2592e6){super(),this.sharedArray=e,this.RetentionPeriod=t*i,this.lastTimestamp=Date.now()*i,this.localMap=new Map,this._initializeMap(),this.sharedArray.observe(((e,t)=>this._updateOnChange(e,t)))}[Symbol.iterator](){return[...this.localMap.entries()].filter((e=>"Value"in e[1])).map((e=>[e[0],e[1].Value]))[Symbol.iterator]()}get size(){let e=0;return this.localMap.forEach((t=>{"Value"in t&&e++})),e}clear(){this.size>0&&this.sharedArray.doc.transact((()=>{this._removeAnyObsoleteDeletions(),this.sharedArray.delete(0,this.sharedArray.length),this.localMap.forEach(((e,t)=>{if("Value"in e){this._updateLastTimestampWith(Date.now()*i);let e={Key:t,Timestamp:this.lastTimestamp};this.localMap.set(t,e),this.sharedArray.push([e])}else this.sharedArray.push([e])}))}))}delete(e){return!!this.localMap.has(e)&&(this.sharedArray.doc.transact((()=>{this._removeAnyLogEntriesForKey(e),this._removeAnyObsoleteDeletions(),this._updateLastTimestampWith(Date.now()*i);let t={Key:e,Timestamp:this.lastTimestamp};this.localMap.set(e,t),this.sharedArray.push([t])})),!0)}entries(){const e=this.localMap.entries();return{[Symbol.iterator](){return this},next:()=>{let t=e.next();for(;!t.done;){let[a,s]=t.value;if("Value"in s)return{value:[a,s.Value]};t=e.next()}return{done:!0}}}}forEach(e,t){this.localMap.forEach(((a,s)=>{"Value"in a&&e.call(t,a.Value,s,this)}))}get(e){return this.localMap.has(e)?this.localMap.get(e).Value:void 0}has(e){return this.localMap.has(e)&&"Value"in this.localMap.get(e)}keys(){const e=this.localMap.entries();return{[Symbol.iterator](){return this},next:()=>{let t=e.next();for(;!t.done;){let[a,s]=t.value;if("Value"in s)return{value:a};t=e.next()}return{done:!0}}}}set(e,t){this.sharedArray.doc.transact((()=>{this._removeAnyLogEntriesForKey(e),this._removeAnyObsoleteDeletions(),this._updateLastTimestampWith(Date.now()*i);let a={Key:e,Value:t,Timestamp:this.lastTimestamp};this.localMap.set(e,a),this.sharedArray.push([a])}))}values(){const e=this.localMap.entries();return{[Symbol.iterator](){return this},next:()=>{let t=e.next();for(;!t.done;){let[a,s]=t.value;if("Value"in s)return{value:s.Value};t=e.next()}return{done:!0}}}}transact(e,t){this.sharedArray.doc.transact(e,t)}get Container(){return this.sharedArray}_LogEntryIsBroken(e){return null==e||"string"!=typeof e.Key||"number"!=typeof e.Timestamp||!isFinite(e.Timestamp)||e.Timestamp<0||Math.floor(e.Timestamp)!==e.Timestamp}_md5Hash(e){try{return r.default(JSON.stringify(e))}catch(e){return""}}_ChangesCollide(e,t){return e.Timestamp>t.Timestamp||e.Timestamp===t.Timestamp&&e.Value!==t.Value&&this._md5Hash(e.Value)>this._md5Hash(t.Value)}_initializeMap(){const e=new Map,t=this.sharedArray.toArray();this.sharedArray.doc.transact((()=>{for(let a=t.length-1;a>=0;a--){const s=t[a],r=s.Key,i=this.localMap.has(r)||e.has(r),l=i?this.localMap.get(r)||e.get(r):void 0;if("Value"in s)switch(!0){case!i:this.localMap.set(r,s),this._updateLastTimestampWith(s.Timestamp);break;case this._ChangesCollide(l,s):console.warn('LWWMap: timestamp mismatch for key "'+r+'"'),this.sharedArray.delete(a);break;default:e.delete(r),this.localMap.set(r,s),this._updateLastTimestampWith(s.Timestamp)}else switch(!0){case!i:e.set(r,s),this._updateLastTimestampWith(s.Timestamp);break;case this._ChangesCollide(l,s):console.warn('LWWMap: timestamp mismatch for key "'+r+'"'),this.sharedArray.delete(a);break;default:e.set(r,s),this.localMap.delete(r),this._updateLastTimestampWith(s.Timestamp)}}}))}_updateOnChange(e,t){const a=new Map;let s=this.lastTimestamp;const r=new Map;function i(e){if(s=Math.max(s,e),s>=Number.MAX_SAFE_INTEGER)throw new TypeError("timestamp has reached the allowed limit")}const l=Array.from(e.changes.added).map((e=>e.content.getContent())).flat();try{l.forEach((e=>{if(this._LogEntryIsBroken(e))return;const t=e.Key,s=r.has(t)||this.localMap.has(t),l=s?r.get(t)||this.localMap.get(t):void 0;switch(!0){case!("Value"in e):if(s){if(this._ChangesCollide(l,e))return void console.warn("LWWMap: remotely deleted entry was later modified locally",l.Timestamp,e.Timestamp);i(e.Timestamp),a.set(t,e),r.set(t,{action:"delete",oldValue:l.Value})}break;case s&&this._ChangesCollide(l,e):return void console.warn("LWWMap: remote change is outdated",l.Timestamp,e.Timestamp);default:i(e.Timestamp),a.set(t,e),this.localMap.has(t)?r.set(t,{action:"update",oldValue:l.Value,newValue:e.Value}):r.set(t,{action:"add",newValue:e.Value})}}))}catch(e){if(e.message.startsWith("Conflict: ")){const e=new Set,t=new Set;l.forEach((a=>{e.add(a.Key),t.add(a)}));const a=this.sharedArray.toArray();return void this.sharedArray.doc.transact((()=>{const s=new Map;for(let r=a.length-1;r>=0;r--){let i=a[r],l=i.Key;switch(!0){case t.has(i):this.sharedArray.delete(r);break;case e.has(l):s.has(l)||s.set(l,i),this.sharedArray.delete(r)}}for(const[e,t]of s)this.sharedArray.push([t])}))}throw e}if(r.size>0){for(const[e,t]of a)this.localMap.set(e,t);this.lastTimestamp=s}if(this._removeAnyBrokenLogEntries(),this._removeAnyObsoleteDeletions(),r.size>0){const e=this.sharedArray.toArray();this.sharedArray.doc.transact((()=>{for(let t=e.length-1;t>=0;t--){const a=e[t],s=a.Key;r.has(s)&&r.get(s).newValue!==a.Value&&this.sharedArray.delete(t)}}))}r.size>0&&this.emit("change",[r,t])}_removeAnyBrokenLogEntries(){const e=this.sharedArray.toArray();for(let t=e.length-1;t>=0;t--){const a=e[t];this._LogEntryIsBroken(a)&&this.sharedArray.delete(t)}}_removeAnyLogEntriesForKey(e){const t=this.sharedArray.toArray();for(let a=t.length-1;a>=0;a--){t[a].Key===e&&this.sharedArray.delete(a)}}_removeAnyObsoleteDeletions(){let e=Date.now()*i-this.RetentionPeriod;const t=this.sharedArray.toArray();for(let a=t.length-1;a>=0;a--){const s=t[a];!("Value"in s)&&s.Timestamp<e&&(this.localMap.delete(s.Key),this.sharedArray.delete(a))}}_updateLastTimestampWith(e){let t=Math.max(this.lastTimestamp+1,e);if(t>=Number.MAX_SAFE_INTEGER)throw new TypeError("timestamp has reached the allowed limit");this.lastTimestamp=t}}e.LWWMap=l,Object.defineProperty(e,"__esModule",{value:!0})}));
//# sourceMappingURL=LWWMap.js.map
