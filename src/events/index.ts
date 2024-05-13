import * as messageCreate from "./messageCreate"
import * as guildCreate from "./guildCreate"
import * as interactionCreate from "./interactionCreate"
import * as messageUpdate from "./messageUpdate"

export const events = {
    messageCreate, guildCreate, interactionCreate, messageUpdate
}

export default events;