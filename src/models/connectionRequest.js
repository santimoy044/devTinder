const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserid : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "User",
    },
    toUserid : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "User",
    },
    status : {
        type : String,
        required : true,
        enum : {
            values : ["ignored", "accepted", "rejected", "intrested"],
            message : `{VALUE} is not a valid status`,
        }
    }
}, {
    timestamps : true
});

connectionRequestSchema.index({fromUserid : 1, toUserid : 1});

connectionRequestSchema.pre("save", function (next) {
    if (this.fromUserid.equals(this.toUserid)) {
        return next(new Error("You cannot send a connection request to yourself")); // ✅ Correct way
    }
    next();
});


const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);
module.exports = ConnectionRequest;

