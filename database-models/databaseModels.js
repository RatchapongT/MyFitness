var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
var userSchema = new Schema({
    username: {type: String, required: 'Username required', uppercase: true},
    password: {type: String, required: 'Password required'},
    created: {type: Date, default: Date.now}
});

userSchema.index({username: 1}, {unique: true});

var weightSchema = new Schema({
    _userDetail: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: 'User Detail required'
    },
    weight: {type: Number, required: 'Weight required'},
    cloth: Boolean,
    afterMeal: Boolean,
    beforeMeal: Boolean,
    timestamp: {type: Date, default: Date.now},
    created: {type: Date, default: Date.now}
});

var incrementSchema = new Schema({
    index: Number,
    _userDetail: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: 'User Detail required'
    },
    created: {type: Date, default: Date.now}
});

var workoutSchema = new Schema({
    index: Number,
    _userDetail: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: 'User Detail required'
    },
    superset: [
        {
            workoutName: {type: String, required: 'Workout Name required'},
            workoutSet: [
                {
                    rep: Number,
                    weight: Number,
                    timestamp: {type: Date, default: Date.now}
                }
            ]
        }
    ],
    timestamp: {type: Date, default: Date.now},
    created: {type: Date, default: Date.now}
});
userSchema.index({index: 1}, {unique: true});
var cardioSchema = new Schema({
    _userDetail: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: 'User Detail required'
    },
    cardioName: {
        type: String,
        required: 'Cardio Name required',
        uppercase: true
    },
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
var Increment = mongoose.model('Increment', incrementSchema);
module.exports = {
    User: User,
    Weight: Weight,
    Workout: Workout,
    Cardio: Cardio,
    Increment: Increment
};