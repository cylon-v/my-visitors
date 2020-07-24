const Cat = mongoose.model('Cat', { name: String });

const kitty = new Cat({ name: 'Zildjian' });
kitty.save().then(() => console.log('meow'));

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true});

