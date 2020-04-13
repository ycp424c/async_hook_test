module.exports = function(){
	return new Promise(resolve=>{
		console.log('user async done')

		resolve(123)
	})
	// let sleep = (timeout)=>new Promise(resolve=> setTimeout(resolve,timeout))

	// await sleep(500)

	
}