import mongoose, { Schema } from "mongoose";

const RuleSchema = new Schema({
    Ruleset : { type: Object, default: {
        number: {type : number},
        indexInfo: { type: String }
    }},
});

