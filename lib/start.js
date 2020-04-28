// start.js
import LineUnitizer from './line-unitizer';
import Repl from './repl';

process.stdin
    .pipe(new LineUnitizer())
    .pipe(
        (new Repl())
            .on("add", function (args) {
                var sum = args.map(Number).reduce((a, b) => a + b, 0);
                console.log("add result: %d", sum);
            })
            .on("shout", function (args) {
                var allcaps = args.map(s => s.toUpperCase()).join(" ");
                console.log(allcaps);
            })
            .on("exit", function (args) {
                console.log("kthxbai!");
                process.exit();
            }));