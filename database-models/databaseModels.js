var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {type: String, required: 'Username required', uppercase: true},
    password: {type: String, required: 'Password required'},
    created: {type: Date, default: Date.now}
});

userSchema.index({username: 1}, {unique: true});

var weightSchema = new Schema({
    _userDetail: {type: Schema.Types.ObjectId, ref: 'User', required: 'User Detail required'},
    weight: {type: Number, required: 'Weight required'},
    cloth: Boolean,
    afterMeal: Boolean,
    beforeMeal: Boolean,
    timestamp: {type: Date, default: Date.now},
    created: {type: Date, default: Date.now}
});

var workoutSchema = new Schema({
    _userDetail: {type: Schema.Types.ObjectId, ref: 'User', required: 'User Detail required'},
    workoutName: {type: String, required: 'Workout Name required', uppercase: true},
    rep: {type: Number, required: 'Rep required'},
    weight: {type: Number, required: 'Weight required'},
    timestamp: {type: Date, default: Date.now},
    created: {type: Date, default: Date.now}
});

var cardioSchema = new Schema({
    _userDetail: {type: Schema.Types.ObjectId, ref: 'User', required: 'User Detail required'},
    cardioName: {type: String, required: 'Cardio Name required', uppercase: true},
    miles: Number,
    calories: Number,
    roundPerMinute: Number,
    averageSpeed: Number,
    duration: Number,
    timestamp: {type: Date, default: Date.now},
    created: {type: Date, default: Date.now}
});

var User = mongoose.model('User', userSchema);
var Weight = mongoose.model('Weight', weightSchema);
var Workout = mongoose.model('Workout', workoutSchema);
var Cardio = mongoose.model('Cardio', cardioSchema);

module.exports = {
    User: User,
    Weight: Weight,
    Workout: Workout,
    Cardio: Cardio
};