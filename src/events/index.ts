import * as messageCreate from "./messageCreate"
import * as guildCreate from "./guildCreate"
import * as interactionCreate from "./interactionCreate"
import * as messageUpdate from "./messageUpdate"
import * as messageDelete from "./messageDelete"
import * as buttonAction from "./buttonAction"

export const events = {
    messageCreate, guildCreate, interactionCreate, messageUpdate, messageDelete, buttonAction
}

export default events;