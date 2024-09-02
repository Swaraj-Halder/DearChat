import mongoose, {Schema} from "mongoose"

// Define the Message schema
const messageSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  chatRoom: {
    type: Schema.Types.ObjectId,
    ref: 'ChatRoom',
    required: true,
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read', 'unsent'],
    default: 'unsent',
  }
},
{timestamps:true});

// Export the Message model
const Message = mongoose.model('Message', messageSchema);


export {Message}
