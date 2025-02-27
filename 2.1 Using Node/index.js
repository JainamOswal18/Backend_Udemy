function linearSearch(arr, key) {
    for (var i = 0; i < arr.length; i++){
        if (arr[i] === key) {
            console.log("Key Found At Index : " + i);
            return;
        }
    }
    console.log("404! Key Not Found");
}

var array = [2, 4, 6, 7, 8, 996, 965, 79, 797];

linearSearch(array, 996);