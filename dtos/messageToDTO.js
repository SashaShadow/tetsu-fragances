class MessageToDTO {
    constructor(rawMsg) {
        this.author = rawMsg.author;
        this.text = rawMsg.text;
        this.time = rawMsg.time;
        this.to = rawMsg.to;
    }
}

export default MessageToDTO;