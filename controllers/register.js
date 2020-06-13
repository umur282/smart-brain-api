const handleRegister = (req, res, db, bcrypt) => {
	const { email, name, password } = req.body;

	if (!email || !name || !password) {
		return res.status(400).json('incorrect form of submission');
	}

	const salt = 10;
	const hash = bcrypt.hashSync(password, salt);

	db.transaction(trx => {
		trx.insert({
			hash,
			email
		})
		.into('login')
		.then(()=> {
			return trx('users')
				.returning('*')
				.insert({
					email,
					name,
					joined: new Date()
				})
				.then(user => {
					res.status(201).send(user[0]);
				});
		})
		.then(trx.commit)
		.catch(trx.rollback);
	})
	.catch(err => res.status(400).json('unable to register'));
}

module.exports = {
	handleRegister
};