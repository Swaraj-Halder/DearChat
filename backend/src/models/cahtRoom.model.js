import mongoose, {Schema} from "mongoose"

// Define the ChatRoom schema
const chatRoomSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  messages: [{
    type: Schema.Types.ObjectId,
    ref: 'Message'
  }],
  createdBy: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }]
},
{timestamps:true});

// Export the ChatRoom model
const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);
export{ChatRoom}
