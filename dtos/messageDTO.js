class MessageDTO {
    constructor(rawMsg) {
        this.author = rawMsg.author;
        this.text = rawMsg.text;
        this.time = rawMsg.time;
    }
}

export default MessageDTO;