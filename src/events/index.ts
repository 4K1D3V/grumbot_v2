import * as messageCreate from "./messageCreate"
import * as guildCreate from "./guildCreate"
import * as interactionCreate from "./interactionCreate"
import * as messageUpdate from "./messageUpdate"
import * as messageDelete from "./messageDelete"

export const events = {
    messageCreate, guildCreate, interactionCreate, messageUpdate, messageDelete
}

export default events;