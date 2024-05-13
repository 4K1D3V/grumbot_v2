import * as messageCreate from "./messageCreate"
import * as guildCreate from "./guildCreate"
import * as interactionCreate from "./interactionCreate"

export const events = {
    messageCreate, guildCreate, interactionCreate,
}

export default events;