class Util {

    static PrefixInteger(num, length) {
        return (Array(length).join('0') + num).slice(-length);
    }
}