module.exports = (function (async) {
    var Flow = function () {
        this.stack = [];
    }

    Flow.prototype.next = function (func) {
        this.stack.push(func);
        return this;
    }

    Flow.prototype.parallel = function (func) {

        if (this.stack[this.stack.length - 1] instanceof Array)
            this.stack[this.stack.length - 1].push(func);
        else
            this.stack.push([func]);
        return this;
    }

    Flow.prototype.done = function (func) {
        var self = this
            , stack = [];

        for (var i in this.stack) {
            if (this.stack[i]instanceof Array) {
                var parallelWrapper = function () {
                    var arg = Array.prototype.slice.call(arguments, 0, arguments.length - 1)
                        , parallelStack = [];
                    for (var j in self.stack[i]) {
                        (function (func) {
                            parallelStack.push(function (done) {
                                func.apply(func, Array.prototype.concat.call(arg, [done]));
                            });
                        })(self.stack[i][j]);
                    }

                    async.parallel(parallelStack, arguments[arguments.length - 1]);
                }

                stack.push(parallelWrapper);
            } else {
                stack.push(this.stack[i]);
            }
        }

        async.waterfall(stack, func);
    }

    return {
        next: function (func) {
            return (new Flow()).next(func);
        },
        parallel: function (func) {
            return (new Flow()).parallel(func);
        }
    }

})(require('async'));