module.exports = function(store) {
    return function(req, res) {
        store.postData(req.body.id, req.body.data)
		.then(result => res.success(result))
		.catch(result => res.faliure(result))
    }
}