const async_hook = require('async_hooks')
const user_async_module = require('./user_async_module')

module.exports = async function(event,context,callback){
	console.log(`user root asyncid: ${async_hook.executionAsyncId()}`)
	let sleep = (timeout)=>new Promise(resolve=> setTimeout(resolve,timeout))

	let TmpInterval = setInterval(()=>{},1000)
	
	clearInterval(TmpInterval)

	await sleep(500)

	sleep(5000).then(()=>{
		console.log('none block 500')
	})

	// console.log('between await')

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