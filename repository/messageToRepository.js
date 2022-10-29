import MessageToDTO from "../dtos/messageToDTO.js";
import DAOFactory from "../factory/DAOfactory.js";

const myDAO = new DAOFactory();

class MessageRepository {
    constructor() {
        this.dao = myDAO.getMsgToDAO();
    }

    async getMessages() {
        const messages = await this.dao.getElems();
        return messages.map(msg => new MessageToDTO(msg));
    }

    async getOwnMsgs(alias) {
        const messages = await this.dao.getOwnMsgs(alias);
        return messages.map(msg => new MessageToDTO(msg));
    }

    async createMessage(msg) {
        return await this.dao.postElem(msg);
    }
}

export default MessageRepository;