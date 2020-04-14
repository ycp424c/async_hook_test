const async_hook = require('async_hooks')
const user_async_module = require('./user_async_module')
const http = require('http');
const {fork} = require('child_process')

module.exports = async function(event,context,callback){
	console.log(`user root asyncid: ${async_hook.executionAsyncId()}`)
	let sleep = (timeout)=>new Promise(resolve=> setTimeout(resolve,timeout))

	// HTTP场景，验证通过，最后会残留一个TCPSERVERWRAP
	// const server = http.createServer((req, res) => {
	// 	res.end();
	//   });
	//   server.on('clientError', (err, socket) => {
	// 	socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
	//   });
	//   server.listen(8000)

	// child_process场景
	fork('./child_async')
	  

	// let TmpInterval = setInterval(()=>{},1000)
	
	// clearInterval(TmpInterval)

	// await sleep(500)

	// sleep(1000).then(()=>{
	// 	console.log('none block 1000')
	// 	return sleep(1000)
	// }).then(()=>{
	// 	console.log('none block 2000')
		
	// })


	// await sleep(5000)

	console.log(`after await asyncid: ${async_hook.executionAsyncId()}`)
	// setTimeout(()=>{
	// 	console.log(`user timeout asyncid: ${async_hook.executionAsyncId()}`)
	// 	console.log('do sth in user code after 1500')
	// },1500)

	// throw new Error('abc')
	
	let async_return = await user_async_module()

	return 'hello world' + async_return
}