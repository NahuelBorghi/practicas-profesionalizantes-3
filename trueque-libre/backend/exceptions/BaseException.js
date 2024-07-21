class BaseException {
    constructor(
        message,
        statusCode = 500,
        stack,
        codeMessageLanguage,
        error = undefined
    ) {
        this.message = message;
        this.stack = stack;
        this.error = error;
        this.statusCode = statusCode;
        // TODO: Replace 'codeMessageLanguage' 'xxxx' with project name
        codeMessageLanguage ?
            this.codeMessageLanguage = codeMessageLanguage
            : this.codeMessageLanguage = "SharepointApiErrorGeneric";
    }

    toString() {
        return this.message;
    }

    toJsonResponse() {
        return { status: "error", message: this.message };
    }
}

module.exports = BaseException;
