Must be installed
    mongoose
    
Must be set mongoose.connect on 14 line in /server/app.js

Api

    POST /removepin, {target} : remove pin
    POST /addpin, {
        id: Number,
        value: String
    } : add pin
    GET /pins : get all pin
    POST /singlepin, {target} : get single pin


