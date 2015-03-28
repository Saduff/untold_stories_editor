
ko.observableArray.fn.swap = function(index1, index2) {
    this.valueWillMutate();

    var temp = this()[index1];
    this()[index1] = this()[index2];
    this()[index2] = temp;

    this.valueHasMutated();
}