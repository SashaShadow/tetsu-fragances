
class MessageService {
    constructor(repository) {
        this.repository = repository;
    }

    async getMsgs() {
        return this.repository.getMessages();
    }

    async getOwnMsgs(alias) {
        return this.repository.getOwnMsgs(alias);
    }

    async createMsgs(msg) {
        return this.repository.createMessage(msg)
    }
}

export default MessageService;