export const persons = [
    {
        name: 'Daniel Karimi 1',
        phone1: 123456,
        email: 'dk807@live.mdx.ac.uk',
        otherPhoneNum: true,
        phone2: 987,
        greet() {
            console.log(`Hello ${this.name} from external file!`);
        },
        printNum() {
            if (this.otherPhoneNum) {
                return console.log(this.phone1, '\n' + this.phone2);
            }
            console.log(this.phone1);
        }
    },
    {
        name: 'Daniel Karimi 2',
        phone1: 628754,
        email: 'dk807@live.mdx.ac.uk',
        otherPhoneNum: false,
        greet() {
            console.log(`Hello ${this.name} from external file!`);
        },
        printNum() {
            if (this.otherPhoneNum) {
                return console.log(this.phone1, this.phone2);
            }
            console.log(this.phone1);
        }
    }
]