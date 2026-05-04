// Example JavaScript code with issues
var userName = "John";  // Should use let or const
var userAge = 25;

function calculateDiscount(price, discountPercent) {
    console.log("Calculating discount");  // Remove before production
    
    if (price == 100) {  // Should use ===
        return price * (discountPercent / 100);
    }
    
    if (discountPercent > 0) {
        if (discountPercent < 50) {
            if (price > 1000) {
                return price * 0.5;
            } else if (price > 500) {
                return price * 0.3;
            } else {
                return price * 0.1;
            }
        }
    }
    
    return 0;
}

// Complex nested loops
for (var i = 0; i < 10; i++) {
    for (var j = 0; j < 10; j++) {
        for (var k = 0; k < 10; k++) {
            console.log(i + j + k);
        }
    }
}
