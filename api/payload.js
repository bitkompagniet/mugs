module.exports = function(){
	return {
		succes: function(res) {
			console.log(res)
			res.send({result: res})
		},
		error: err => res.send({error: err})
	}
}