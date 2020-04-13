const async_hook = require('async_hooks')
const fs = require('fs')
const http = require('http')

function printLog(message){
	fs.writeFileSync(1,message)
	fs.writeFileSync(1,'\n')
}

function allAsyncEndCallback(rootAsyncId){
	console.log(`rootAsyncId: ${rootAsyncId}`)
	let watchingHookIdList = [rootAsyncId]
	let hookList = []
	let hook = async_hook.createHook({
		init:(hookId,type,triggerAsyncId,resource)=>{
			// printLog('init async hook:' + async_hook.executionAsyncId())
			if(watchingHookIdList.indexOf(triggerAsyncId)>=0){
				watchingHookIdList.push(hookId)
			}
			printLog(`${triggerAsyncId} -> ${hookId} init ,type :${type} `)
			// printLog('resource:')
			// Object.keys(resource).forEach(key=>{
			// 	printLog(`${key}:${resource[key]}`)
			// })
			if(type !== 'SIGNALWRAP' && type!== 'TTYWRAP' && watchingHookIdList.indexOf(hookId) >= 0){
				hookList.push({hookId,triggerAsyncId,type,rootAsyncId})
			}
			// printLog(hookList)
		},
		destroy:(hookId)=>{
			printLog(`${hookId} destroy`)
			// printLog(`destroy hook hook id : ${async_hook.executionAsyncId()}`)
			if(hookList.find(item=>item.hookId === hookId)){
				hookList.splice(hookList.findIndex(item=>item.hookId === hookId),1)
				printLog(`left list: ${JSON.stringify(hookList)}`)
				if(hookList.length === 0){
					hook.disable()
					// callback()
					printLog('all async done')
				}
			}
		},
		after:(hookId)=>{
			printLog(`${hookId} after`)
			let hook = hookList.find(item=>item.hookId === hookId)
			if(hook && hook.type === 'PROMISE'){
				hookList.splice(hookList.findIndex(item=>item.hookId === hookId),1)
				printLog(`left list: ${JSON.stringify(hookList)}`)
				if(hookList.length === 0){
					hook.disable()
					printLog('all async done')
				}
			}
		}
	})
	hook.enable()
}

// allAsyncEndCallback()

// process.on('beforeExit',()=>{
// 	console.log('========exit=======')
// 	console.log(hookList)
// })

// ;(async()=>{
// 	printLog(`main id :${async_hook.executionAsyncId()}`)
// 	allAsyncEndCallback(()=>{
// 		printLog('all async end')
// 	})
// 	setTimeout(()=>{
// 		printLog('1s timeout')
// 	},1000)
// 	let times = 0
// 	let intervalId = setInterval(()=>{
// 		// printLog(`${times} interval`)
// 		console.log(`${times} interval`)
// 		times ++
// 		if(times>3){
// 			clearInterval(intervalId)
// 		}
// 	},800)
// 	// console.log(123)
// })()

// const server = http.createServer((req,res)=>{
// 	res.end('hello world');
// })

// server.listen(8899)


const express = require('express')
const app = express()
const port = 8900
let userCode

app.get('/', (req, res) => {
	userCode = userCode ||  require('./user_code')

	setTimeout(async ()=>{
		let asyncId = async_hook.executionAsyncId()
		

		allAsyncEndCallback(asyncId)
		console.log('between a & u')
		// userCode().then(ret=>{
		// 	res.end(ret)
		// 	console.log('res end asyncid:' + async_hook.executionAsyncId())
		// })
		let ret = await userCode() 
		res.end(ret)
	},0)
	
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
// setTimeout(()=>{
// 	app.get('/', (req, res) => res.send('Hello World!'))

// 	app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
// },0)
