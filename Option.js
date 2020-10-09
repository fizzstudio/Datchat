const Option = class {
    constructor(content, keywords, callback, type) {
        this.content = content;
        this.keywords = keywords;
        this.callback = callback;
        this.type = type;
        this.occurrence = 0;
        this.answers = [];
        if (this.type == Option.Types.COMPUTATIONAL) {
            this.state = states.UNASKED;
        } else if (this.type == Option.Types.OPERATIONAL) {
            this.state = states.UNIFORM;
        }
        console.log("Option: ", this.state);

    }
    getContent() {
        return this.content;
    }

    addAnswer(answer) {
        this.answers.push(answer);
    }

    getAnswers() {
        return this.answers;
    }

    getState() {
        return this.state;
    }

    updateState(state) {
        this.state = state;
    }

    resetState() {
        this.state = states.UNASKED;
    }

    getKeywords() {
        return this.keywords;
    }

    addCount() {
        this.occurrence += 1;
    }
    getCount() {
        return this.occurrence;
    }
}

Option.Types = {
    COMPUTATIONAL: 0,
    OPERATIONAL: 1
}