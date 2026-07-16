// import { Images } from "../utils/constants";

// let code=""
// let inputTestCase=""
// const  LanguageConfig = {
//     cpp: {
//         cmdExecutable: [
//                 "/bin/sh",
//                 "-c",
//                 `echo '${this.code.replace(/'/g, `'\\"`)}' > test.py && echo '${this.inputTestCase.replace(/'/g, `'\\"`)}' | python3 test.py`,
//             ],
//         image:Images["C++"]
//     },
//     python: {
//         cmdExecutable: [
//             "/bin/sh",
//             "-c",
//             `echo '${code.replace(/'/g, `'\\"`)}' > main.cpp && g++ main.cpp -o main && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | stdbuf -oL -eL ./main`,
//         ],
//         image:Images["C++"]
//     },
// };

// export default LanguageConfig