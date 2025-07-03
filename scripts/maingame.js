
var grid;


// ctx.fillStyle = "rgb(200 0 0)";
// ctx.fillRect(10, 10, 50, 50);
// ctx.fillStyle = "rgb(0 0 200 / 50%)";
// ctx.fillRect(30, 30, 50, 50);
canvas = document.getElementById('Canvas');
window.addEventListener('load', function () { grid = new Grid(canvas.clientWidth, canvas.clientHeight); grid.DrawGrid() }, false)
window.addEventListener('keydown', (e) => { grid.KeyPresses(e) })

class Grid {
    constructor(Width, Height) {
        this.IntervalID = null;
        this.running = false;
        this.width = Width;
        this.height = Height;
        this.x = Math.trunc(this.width / 5);
        this.y = Math.trunc(this.height / 5);
        this.arra = makeArray(this.x,);
        this.canvas = document.getElementById('Canvas');
        this.ctx = canvas.getContext('2d');
        this.canvas.addEventListener('click', (event) => { this.ClickGrid(event); this.DrawGrid() });
    }
    ClickGrid(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.trunc((event.pageX - rect.left) / 5),
            y = Math.trunc((event.pageY - rect.top - window.scrollY) / 5);
        if (this.arra[x - 1][y - 1] === 1) {
            this.arra[x - 1][y - 1] = 0;
        }
        else {
            this.arra[x - 1][y - 1] = 1;
        }

    }
    DrawGrid() {
        for (let i = 0; i < this.x; i++) {
            for (let j = 0; j < this.y; j++) {
                if (this.arra[i][j] === 1) {
                    this.ctx.fillStyle = "rgb(0 0 0)";
                }
                else {
                    this.ctx.fillStyle = "rgb(255 255 255)";
                }
                this.ctx.fillRect(5 * i, 5 * j, 5, 5);
            }
        }
    }
    KeyPresses(e) {
        if (e.keyCode === 32) {
            this.running = (!(this.running));
            if (this.running) { this.Run() } else { this.Stop() }
        }
    }
    Run() {
        this.IntervalID = setInterval(() => {
            let next = [...this.arra];
            for (let i = 0; i < this.x; i++) {
                for (let j = 0; j < this.y; j++) {
                    var total = this.FindTotalSurrounmding(i, j);
                    if (total < 2) {
                        next[i][j] = 0; // Underpopulation
                    } else if (total > 3) {
                        next[i][j] = 0; // overpopulation
                    } else if (total === 3 || total === 2) {
                        next[i][j] = 1;
                    } else {
                        next[i][j] = 0;
                    }
                }
            }
            this.arra = next;
            //console.log(this.arra);
            this.DrawGrid();
        }, 2000);
        // The above code runs every 2000 milliseconds, you can adjust this value for speed
    }
    Stop() {
        clearInterval(this.IntervalID);
    }
    FindTotalSurrounmding(i, j) {
        let total = 0;
        [-1, 0, 1].forEach(dx => {
            [-1, 0, 1].forEach(dy => {
                total += this.GetValue(i + dx, j + dy);
            });
        });
        if (this.arra[i][j] === 1) {
            total--; // Don't count the current cell
        }
        return total;
    }
    GetValue(x, y) {
        if (x < 0 || x >= this.x || y < 0 || y >= this.y) {
            return 0; // Out of bounds
        }
        if ((this.arra[x][y] !== 0 && this.arra[x][y] !== 1)) {
            return 0; //not defined
        }
        return this.arra[x][y];
    }
}

function makeArray(d1, d2) {
    let finalarr = new Array(d1).fill([...Array(d2).fill(0)]);
    return finalarr;
}