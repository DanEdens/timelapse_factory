// repl.js
import {Writable} from 'stream';

class Repl extends Writable {
    _parse(line) {
        var [cmd, ...args] = line.split(/\s+/);
        return {cmd, args};
    }

    _write(line, enc, done) {
        var {cmd, args} = this._parse(line.toString());
        this.emit(cmd, args);
        done();
    }
}

export default Repl;