export default function consoleRender(str: string, obj?: any) {
    console.log(`=========================${str}====================`);
    console.log(str, obj);
    console.log(`=========================${str}====================`);
}
