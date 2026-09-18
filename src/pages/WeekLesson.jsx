import React, { useState } from 'react';

const WeekLesson = ({ weekNum, user, onNavigate, onExerciseComplete, onLogout }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showExercise, setShowExercise] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const weekData = {
    1: {
      titleEn: "Basic Programming Review",
      titleAr: "مراجعة المفاهيم الأساسية",
      icon: "🔄",
      video: { title: "C++ Basics Review", titleAr: "مراجعة أساسيات C++", youtubeId: "vLnPwxZdW4Y", description: "Review of if, while, for, do-while and arrays." },
      content: [
        { type: "intro", titleEn: "Welcome to Week 1!", titleAr: "مرحباً بك في الأسبوع الأول!", contentEn: "This week we review basic programming concepts including control statements and arrays.", contentAr: "هذا الأسبوع نراجع المفاهيم الأساسية للبرمجة بما في ذلك عبارات التحكم والمصفوفات." },
        { type: "code", titleEn: "If-Else Statement", titleAr: "عبارة If-Else", code: `#include <iostream>
using namespace std;

int main() {
    int num;
    cout << "Enter a number: ";
    cin >> num;
    
    if (num > 0) {
        cout << "Positive number";
    } else if (num < 0) {
        cout << "Negative number";
    } else {
        cout << "Zero";
    }
    return 0;
}`, explanation: "if-else allows decision making based on conditions.", explanationAr: "if-else تسمح باتخاذ القرارات بناءً على الشروط." },
        { type: "code", titleEn: "While Loop", titleAr: "حلقة While", code: `int sum = 0, num;
cout << "Enter numbers (1-10), other to stop: ";
cin >> num;

while (num >= 1 && num <= 10) {
    sum += num;
    cin >> num;
}
cout << "Sum: " << sum;`, explanation: "while loop continues as long as condition is true.", explanationAr: "حلقة while تستمر طالما الشرط صحيح." },
        { type: "code", titleEn: "For Loop with Array", titleAr: "حلقة For مع المصفوفة", code: `int arr[5] = {10, 20, 30, 40, 50};

// Display all elements
for (int i = 0; i < 5; i++) {
    cout << arr[i] << " ";
}

// Display even numbers only
for (int i = 0; i < 5; i++) {
    if (arr[i] % 2 == 0) {
        cout << arr[i] << " is even" << endl;
    }
}`, explanation: "for loop is ideal for iterating through arrays.", explanationAr: "حلقة for مثالية للتكرار عبر المصفوفات." }
      ],
      exercises: [
        { q: "Which loop checks condition before execution?", qAr: "أي حلقة تفحص الشرط قبل التنفيذ؟", options: ["do-while", "while", "goto", "switch"], correct: 1 },
        { q: "Array index in C++ starts from:", qAr: "فهرس المصفوفة في C++ يبدأ من:", options: ["1", "0", "-1", "Any number"], correct: 1 },
        { q: "for loop has how many parts?", qAr: "حلقة for لها كم جزء؟", options: ["2", "3", "4", "5"], correct: 1 },
        { q: "break statement is used to:", qAr: "عبارة break تستخدم لـ:", options: ["Continue loop", "Exit loop", "Skip iteration", "Start loop"], correct: 1 },
        { q: "continue statement:", qAr: "عبارة continue:", options: ["Exits loop", "Skips current iteration", "Ends program", "Restarts loop"], correct: 1 }
      ]
    },
    2: {
      titleEn: "Predefined & User Functions",
      titleAr: "الدوال المعرفة والجاهزة",
      icon: "⚙️",
      video: { title: "Functions in C++", titleAr: "الدوال في C++", youtubeId: "V9zuox47zr0", description: "Learn about built-in and user-defined functions." },
      content: [
        { type: "intro", titleEn: "Welcome to Week 2!", titleAr: "مرحباً بك في الأسبوع الثاني!", contentEn: "Functions help organize code into reusable blocks. C++ has built-in functions and allows you to create your own.", contentAr: "الدوال تساعد في تنظيم الكود إلى كتل قابلة لإعادة الاستخدام. C++ لديها دوال جاهزة وتسمح لك بإنشاء دوالك الخاصة." },
        { type: "code", titleEn: "Built-in Math Functions", titleAr: "دوال الرياضيات الجاهزة", code: `#include <iostream>
#include <cmath>  // Math library
using namespace std;

int main() {
    double x = 16.0, y = 2.0;
    
    cout << "sqrt(16) = " << sqrt(x) << endl;   // 4
    cout << "pow(2,3) = " << pow(y, 3) << endl; // 8
    cout << "abs(-5) = " << abs(-5) << endl;    // 5
    cout << "ceil(4.2) = " << ceil(4.2) << endl; // 5
    cout << "floor(4.8) = " << floor(4.8) << endl; // 4
    
    return 0;
}`, explanation: "cmath library provides mathematical functions like sqrt, pow, abs.", explanationAr: "مكتبة cmath توفر دوال رياضية مثل sqrt, pow, abs." },
        { type: "code", titleEn: "User-Defined Function", titleAr: "دالة معرفة من المستخدم", code: `#include <iostream>
using namespace std;

// Function prototype
int findMax(int a, int b);

int main() {
    int x = 10, y = 20;
    cout << "Max: " << findMax(x, y);  // 20
    return 0;
}

// Function definition
int findMax(int a, int b) {
    if (a > b)
        return a;
    else
        return b;
}`, explanation: "User-defined functions have: return type, name, parameters, and body.", explanationAr: "الدوال المعرفة من المستخدم لها: نوع الإرجاع، الاسم، المعاملات، والجسم." }
      ],
      exercises: [
        { q: "sqrt() is found in which library?", qAr: "sqrt() موجودة في أي مكتبة؟", options: ["iostream", "cmath", "string", "cstdlib"], correct: 1 },
        { q: "Function prototype ends with:", qAr: "نموذج الدالة ينتهي بـ:", options: ["{ }", ":", ";", "()"], correct: 2 },
        { q: "pow(2,3) returns:", qAr: "pow(2,3) ترجع:", options: ["6", "8", "5", "9"], correct: 1 },
        { q: "A function with no return value uses:", qAr: "الدالة بدون قيمة إرجاع تستخدم:", options: ["int", "double", "void", "null"], correct: 2 },
        { q: "ceil(3.1) returns:", qAr: "ceil(3.1) ترجع:", options: ["3", "4", "3.1", "3.5"], correct: 1 }
      ]
    },
    3: {
      titleEn: "Functions & Parameters",
      titleAr: "الدوال وتمرير المعاملات",
      icon: "📥",
      video: { title: "Parameter Passing in C++", titleAr: "تمرير المعاملات في C++", youtubeId: "WqukJuBnLQU", description: "Call by value vs call by reference." },
      content: [
        { type: "intro", titleEn: "Welcome to Week 3!", titleAr: "مرحباً بك في الأسبوع الثالث!", contentEn: "Learn the difference between call by value and call by reference, and understand variable scope.", contentAr: "تعلم الفرق بين التمرير بالقيمة والتمرير بالمرجع، وافهم نطاق المتغيرات." },
        { type: "concept", titleEn: "Parameter Passing Methods", titleAr: "طرق تمرير المعاملات", contentEn: "C++ supports two ways to pass parameters.", contentAr: "C++ تدعم طريقتين لتمرير المعاملات.", keyPoints: [
          { en: "Call by Value: Copy of value is passed, original unchanged", ar: "التمرير بالقيمة: نسخة من القيمة تُمرر، الأصلية لا تتغير" },
          { en: "Call by Reference: Address is passed, original can change", ar: "التمرير بالمرجع: العنوان يُمرر، الأصلية يمكن أن تتغير" }
        ]},
        { type: "code", titleEn: "Call by Value", titleAr: "التمرير بالقيمة", code: `void addTen(int x) {
    x = x + 10;  // Only local copy changes
    cout << "Inside: " << x << endl;  // 15
}

int main() {
    int num = 5;
    addTen(num);
    cout << "Outside: " << num << endl;  // Still 5!
}`, explanation: "Call by value creates a copy - changes don't affect the original.", explanationAr: "التمرير بالقيمة ينشئ نسخة - التغييرات لا تؤثر على الأصلية." },
        { type: "code", titleEn: "Call by Reference", titleAr: "التمرير بالمرجع", code: `void addTen(int &x) {  // Note the &
    x = x + 10;  // Original changes!
    cout << "Inside: " << x << endl;  // 15
}

int main() {
    int num = 5;
    addTen(num);
    cout << "Outside: " << num << endl;  // Now 15!
}`, explanation: "Call by reference uses & - changes affect the original variable.", explanationAr: "التمرير بالمرجع يستخدم & - التغييرات تؤثر على المتغير الأصلي." },
        { type: "code", titleEn: "Swap Example", titleAr: "مثال التبديل", code: `void swap(int &a, int &b) {
    int temp = a;
    a = b;
    b = temp;
}

int main() {
    int x = 5, y = 10;
    swap(x, y);
    cout << x << ", " << y;  // 10, 5
}`, explanation: "Swapping requires call by reference to modify both variables.", explanationAr: "التبديل يتطلب التمرير بالمرجع لتعديل كلا المتغيرين." }
      ],
      exercises: [
        { q: "Call by reference uses:", qAr: "التمرير بالمرجع يستخدم:", options: ["*", "&", "#", "@"], correct: 1 },
        { q: "Call by value:", qAr: "التمرير بالقيمة:", options: ["Modifies original", "Creates a copy", "Uses pointer", "Returns nothing"], correct: 1 },
        { q: "Local variables are accessible:", qAr: "المتغيرات المحلية يمكن الوصول إليها:", options: ["Everywhere", "Only in their function", "In main only", "Globally"], correct: 1 },
        { q: "Global variables are declared:", qAr: "المتغيرات العامة تُعلن:", options: ["Inside functions", "Outside all functions", "In main only", "In headers only"], correct: 1 },
        { q: "static variable keeps its value:", qAr: "المتغير static يحتفظ بقيمته:", options: ["Never", "Between function calls", "Only once", "In main only"], correct: 1 }
      ]
    },
    4: {
      titleEn: "Enum & Function Overloading",
      titleAr: "التعدادات وزيادة التحميل",
      icon: "🔢",
      video: { title: "Enums and Overloading", titleAr: "التعدادات وزيادة التحميل", youtubeId: "IAMzWp3kS_k", description: "Learn enumeration types and function overloading." },
      content: [
        { type: "intro", titleEn: "Welcome to Week 4!", titleAr: "مرحباً بك في الأسبوع الرابع!", contentEn: "Enumerations create custom types with named constants. Function overloading allows multiple functions with the same name.", contentAr: "التعدادات تنشئ أنواعاً مخصصة مع ثوابت مسماة. زيادة التحميل تسمح بدوال متعددة بنفس الاسم." },
        { type: "code", titleEn: "Enumeration (enum)", titleAr: "التعداد (enum)", code: `#include <iostream>
using namespace std;

enum Day { SUN, MON, TUE, WED, THU, FRI, SAT };
// SUN=0, MON=1, TUE=2, ...

int main() {
    Day today = WED;
    
    if (today == FRI || today == SAT) {
        cout << "Weekend!";
    } else {
        cout << "Weekday";  // This prints
    }
    
    cout << "WED = " << WED;  // WED = 3
    return 0;
}`, explanation: "enum creates a type with named integer constants starting from 0.", explanationAr: "enum ينشئ نوعاً مع ثوابت صحيحة مسماة تبدأ من 0." },
        { type: "code", titleEn: "Function Overloading", titleAr: "زيادة تحميل الدوال", code: `#include <iostream>
using namespace std;

// Same name, different parameters
int add(int a, int b) {
    return a + b;
}

double add(double a, double b) {
    return a + b;
}

int add(int a, int b, int c) {
    return a + b + c;
}

int main() {
    cout << add(5, 3) << endl;        // 8 (int version)
    cout << add(2.5, 3.5) << endl;    // 6.0 (double version)
    cout << add(1, 2, 3) << endl;     // 6 (three params)
    return 0;
}`, explanation: "Overloaded functions have the same name but different parameter lists.", explanationAr: "الدوال المحملة لها نفس الاسم لكن قوائم معاملات مختلفة." },
        { type: "code", titleEn: "Default Parameters", titleAr: "المعاملات الافتراضية", code: `void greet(string name = "Guest") {
    cout << "Hello, " << name << "!" << endl;
}

int main() {
    greet();         // Hello, Guest!
    greet("Ahmed");  // Hello, Ahmed!
    return 0;
}`, explanation: "Default parameters have preset values if no argument is passed.", explanationAr: "المعاملات الافتراضية لها قيم محددة مسبقاً إذا لم يُمرر وسيط." }
      ],
      exercises: [
        { q: "In enum {A, B, C}, what is B's value?", qAr: "في enum {A, B, C}، ما قيمة B؟", options: ["0", "1", "2", "B"], correct: 1 },
        { q: "Function overloading requires:", qAr: "زيادة التحميل تتطلب:", options: ["Same parameters", "Different parameters", "Different names", "No parameters"], correct: 1 },
        { q: "Default parameters are placed:", qAr: "المعاملات الافتراضية توضع:", options: ["First", "Last", "Middle", "Anywhere"], correct: 1 },
        { q: "enum values are:", qAr: "قيم enum هي:", options: ["Strings", "Integers", "Floats", "Characters"], correct: 1 },
        { q: "Two functions with same name and same parameters:", qAr: "دالتان بنفس الاسم ونفس المعاملات:", options: ["Is allowed", "Causes error", "Works fine", "Uses default"], correct: 1 }
      ]
    },
    5: {
      titleEn: "Strings",
      titleAr: "السلاسل النصية",
      icon: "📝",
      video: { title: "C++ Strings", titleAr: "السلاسل النصية في C++", youtubeId: "Gp6E73i0t1k", description: "Working with character arrays and strings." },
      content: [
        { type: "intro", titleEn: "Welcome to Week 5!", titleAr: "مرحباً بك في الأسبوع الخامس!", contentEn: "Strings in C++ can be handled as character arrays or using the string class.", contentAr: "السلاسل في C++ يمكن التعامل معها كمصفوفات حروف أو باستخدام فئة string." },
        { type: "code", titleEn: "Character Arrays (C-strings)", titleAr: "مصفوفات الحروف", code: `#include <iostream>
#include <cstring>  // For string functions
using namespace std;

int main() {
    char str1[20] = "Hello";
    char str2[20] = "World";
    
    cout << "Length: " << strlen(str1) << endl;  // 5
    
    strcat(str1, " ");   // Append space
    strcat(str1, str2);  // Append str2
    cout << str1 << endl;  // Hello World
    
    if (strcmp(str1, str2) == 0)
        cout << "Equal";
    else
        cout << "Not equal";
    
    return 0;
}`, explanation: "C-strings use char arrays with null terminator. cstring provides functions like strlen, strcat, strcmp.", explanationAr: "سلاسل C تستخدم مصفوفات char مع منهي null. cstring توفر دوال مثل strlen, strcat, strcmp." },
        { type: "code", titleEn: "String Class", titleAr: "فئة String", code: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string s1 = "Hello";
    string s2 = "World";
    
    // Concatenation
    string s3 = s1 + " " + s2;
    cout << s3 << endl;  // Hello World
    
    // Length
    cout << "Length: " << s3.length() << endl;  // 11
    
    // Substring
    cout << s3.substr(0, 5) << endl;  // Hello
    
    // Find
    cout << s3.find("World") << endl;  // 6
    
    return 0;
}`, explanation: "string class provides easier string manipulation with methods.", explanationAr: "فئة string توفر معالجة أسهل للسلاسل مع الطرق." }
      ],
      exercises: [
        { q: "strlen() returns:", qAr: "strlen() ترجع:", options: ["Size of array", "Length of string", "First character", "Last character"], correct: 1 },
        { q: "strcat() is used to:", qAr: "strcat() تستخدم لـ:", options: ["Compare", "Copy", "Concatenate", "Find"], correct: 2 },
        { q: "C-strings end with:", qAr: "سلاسل C تنتهي بـ:", options: ["\\n", "\\0", "\\t", "space"], correct: 1 },
        { q: "string class is in:", qAr: "فئة string في:", options: ["iostream", "cstring", "string", "cmath"], correct: 2 },
        { q: "strcmp() returns 0 when strings are:", qAr: "strcmp() ترجع 0 عندما السلاسل:", options: ["Different", "Equal", "Empty", "Long"], correct: 1 }
      ]
    },
    6: {
      titleEn: "Arrays and Loops",
      titleAr: "المصفوفات والحلقات",
      icon: "📊",
      video: { title: "Arrays in C++", titleAr: "المصفوفات في C++", youtubeId: "PyTK_g1l8V8", description: "Working with one-dimensional arrays and loops." },
      content: [
        { type: "intro", titleEn: "Welcome to Week 6!", titleAr: "مرحباً بك في الأسبوع السادس!", contentEn: "Arrays store multiple values of the same type. Loops are essential for processing arrays.", contentAr: "المصفوفات تخزن قيم متعددة من نفس النوع. الحلقات ضرورية لمعالجة المصفوفات." },
        { type: "code", titleEn: "Array Declaration & Initialization", titleAr: "إعلان وتهيئة المصفوفة", code: `int arr1[5];  // Declaration (uninitialized)
int arr2[5] = {10, 20, 30, 40, 50};  // With values
int arr3[] = {1, 2, 3};  // Size inferred (3)

// Input values
int numbers[5];
for (int i = 0; i < 5; i++) {
    cout << "Enter number " << (i+1) << ": ";
    cin >> numbers[i];
}`, explanation: "Arrays can be declared with size or initialized with values.", explanationAr: "المصفوفات يمكن إعلانها بحجم أو تهيئتها بقيم." },
        { type: "code", titleEn: "Array Operations", titleAr: "عمليات المصفوفة", code: `int arr[5] = {15, 8, 23, 4, 42};

// Find sum
int sum = 0;
for (int i = 0; i < 5; i++) {
    sum += arr[i];
}
cout << "Sum: " << sum << endl;

// Find max
int max = arr[0];
for (int i = 1; i < 5; i++) {
    if (arr[i] > max)
        max = arr[i];
}
cout << "Max: " << max << endl;

// Find even numbers
cout << "Even: ";
for (int i = 0; i < 5; i++) {
    if (arr[i] % 2 == 0)
        cout << arr[i] << " ";
}`, explanation: "Use loops to traverse and process array elements.", explanationAr: "استخدم الحلقات للتنقل ومعالجة عناصر المصفوفة." }
      ],
      exercises: [
        { q: "int arr[5]; creates how many elements?", qAr: "int arr[5]; ينشئ كم عنصر؟", options: ["4", "5", "6", "0"], correct: 1 },
        { q: "First index of array is:", qAr: "الفهرس الأول للمصفوفة هو:", options: ["1", "0", "-1", "n"], correct: 1 },
        { q: "Last index of arr[10] is:", qAr: "الفهرس الأخير لـ arr[10] هو:", options: ["10", "9", "11", "0"], correct: 1 },
        { q: "Array name represents:", qAr: "اسم المصفوفة يمثل:", options: ["First element", "Address of first element", "All elements", "Size"], correct: 1 },
        { q: "sizeof(arr)/sizeof(arr[0]) gives:", qAr: "sizeof(arr)/sizeof(arr[0]) تعطي:", options: ["First element", "Last element", "Array size", "Memory size"], correct: 2 }
      ]
    },
    7: {
      titleEn: "2D Arrays",
      titleAr: "المصفوفات ثنائية الأبعاد",
      icon: "🧮",
      video: { title: "2D Arrays in C++", titleAr: "المصفوفات ثنائية الأبعاد", youtubeId: "gDvf7pVIDbw", description: "Working with matrices and nested loops." },
      content: [
        { type: "intro", titleEn: "Welcome to Week 7!", titleAr: "مرحباً بك في الأسبوع السابع!", contentEn: "2D arrays are arrays of arrays, useful for representing matrices and tables.", contentAr: "المصفوفات ثنائية الأبعاد هي مصفوفات من مصفوفات، مفيدة لتمثيل المصفوفات والجداول." },
        { type: "code", titleEn: "2D Array Declaration", titleAr: "إعلان مصفوفة ثنائية الأبعاد", code: `// 3 rows, 4 columns
int matrix[3][4] = {
    {1, 2, 3, 4},
    {5, 6, 7, 8},
    {9, 10, 11, 12}
};

// Access element at row 1, column 2
cout << matrix[1][2];  // 7

// Print all elements
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 4; j++) {
        cout << matrix[i][j] << " ";
    }
    cout << endl;
}`, explanation: "2D arrays use two indices: [row][column]. Nested loops process them.", explanationAr: "المصفوفات ثنائية الأبعاد تستخدم فهرسين: [صف][عمود]. الحلقات المتداخلة تعالجها." },
        { type: "code", titleEn: "Matrix Operations", titleAr: "عمليات المصفوفة", code: `int A[2][2] = {{1, 2}, {3, 4}};
int B[2][2] = {{5, 6}, {7, 8}};
int C[2][2];

// Matrix Addition
for (int i = 0; i < 2; i++) {
    for (int j = 0; j < 2; j++) {
        C[i][j] = A[i][j] + B[i][j];
    }
}

// Print result
for (int i = 0; i < 2; i++) {
    for (int j = 0; j < 2; j++) {
        cout << C[i][j] << " ";
    }
    cout << endl;
}
// Output: 6 8
//         10 12`, explanation: "Matrix operations use nested loops to process each element.", explanationAr: "عمليات المصفوفة تستخدم حلقات متداخلة لمعالجة كل عنصر." }
      ],
      exercises: [
        { q: "int arr[3][4] has how many elements?", qAr: "int arr[3][4] لها كم عنصر؟", options: ["7", "12", "34", "3"], correct: 1 },
        { q: "arr[1][2] means:", qAr: "arr[1][2] تعني:", options: ["Row 1, Column 2", "Row 2, Column 1", "Element 12", "First element"], correct: 0 },
        { q: "2D arrays need how many loops to traverse?", qAr: "المصفوفات ثنائية الأبعاد تحتاج كم حلقة للتنقل؟", options: ["1", "2", "3", "4"], correct: 1 },
        { q: "In arr[2][3], rows count is:", qAr: "في arr[2][3]، عدد الصفوف هو:", options: ["2", "3", "5", "6"], correct: 0 },
        { q: "Matrix multiplication needs:", qAr: "ضرب المصفوفات يحتاج:", options: ["1 loop", "2 loops", "3 loops", "No loops"], correct: 2 }
      ]
    },
    8: {
      titleEn: "Sorting & Searching",
      titleAr: "الفرز والبحث",
      icon: "🔍",
      video: { title: "Sorting and Searching", titleAr: "الفرز والبحث", youtubeId: "pkkFqlG0Hds", description: "Learn bubble sort and linear/binary search." },
      content: [
        { type: "intro", titleEn: "Welcome to Week 8!", titleAr: "مرحباً بك في الأسبوع الثامن!", contentEn: "Sorting arranges elements in order. Searching finds specific elements in arrays.", contentAr: "الفرز يرتب العناصر بالترتيب. البحث يجد عناصر محددة في المصفوفات." },
        { type: "code", titleEn: "Bubble Sort", titleAr: "الفرز الفقاعي", code: `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++) {
        for (int j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                // Swap
                int temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
    }
}

int main() {
    int arr[] = {64, 34, 25, 12, 22};
    int n = 5;
    bubbleSort(arr, n);
    // arr is now: 12, 22, 25, 34, 64
}`, explanation: "Bubble sort compares adjacent elements and swaps if needed.", explanationAr: "الفرز الفقاعي يقارن العناصر المتجاورة ويبدلها إذا لزم الأمر." },
        { type: "code", titleEn: "Linear Search", titleAr: "البحث الخطي", code: `int linearSearch(int arr[], int n, int key) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == key)
            return i;  // Found at index i
    }
    return -1;  // Not found
}

int main() {
    int arr[] = {10, 20, 30, 40, 50};
    int pos = linearSearch(arr, 5, 30);
    cout << "Found at: " << pos;  // 2
}`, explanation: "Linear search checks each element one by one.", explanationAr: "البحث الخطي يفحص كل عنصر واحداً تلو الآخر." },
        { type: "code", titleEn: "Binary Search", titleAr: "البحث الثنائي", code: `int binarySearch(int arr[], int n, int key) {
    int low = 0, high = n - 1;
    
    while (low <= high) {
        int mid = (low + high) / 2;
        
        if (arr[mid] == key)
            return mid;
        else if (arr[mid] < key)
            low = mid + 1;
        else
            high = mid - 1;
    }
    return -1;
}

// Array MUST be sorted!
int arr[] = {10, 20, 30, 40, 50};
int pos = binarySearch(arr, 5, 40);  // 3`, explanation: "Binary search requires sorted array, divides search space in half each time.", explanationAr: "البحث الثنائي يتطلب مصفوفة مرتبة، يقسم مساحة البحث للنصف كل مرة." }
      ],
      exercises: [
        { q: "Bubble sort time complexity:", qAr: "تعقيد الفرز الفقاعي الزمني:", options: ["O(n)", "O(n²)", "O(log n)", "O(1)"], correct: 1 },
        { q: "Binary search requires:", qAr: "البحث الثنائي يتطلب:", options: ["Unsorted array", "Sorted array", "Empty array", "Any array"], correct: 1 },
        { q: "Linear search time complexity:", qAr: "تعقيد البحث الخطي الزمني:", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], correct: 2 },
        { q: "Binary search time complexity:", qAr: "تعقيد البحث الثنائي الزمني:", options: ["O(n)", "O(n²)", "O(log n)", "O(1)"], correct: 2 },
        { q: "If element not found, search returns:", qAr: "إذا العنصر غير موجود، البحث يرجع:", options: ["0", "-1", "n", "null"], correct: 1 }
      ]
    },
    9: {
      titleEn: "Structures & Objects",
      titleAr: "الهياكل والكائنات",
      icon: "🏗️",
      video: { title: "Structures in C++", titleAr: "الهياكل في C++", youtubeId: "6gg9Xlv35-I", description: "Learn about struct and organizing data." },
      content: [
        { type: "intro", titleEn: "Welcome to Week 9!", titleAr: "مرحباً بك في الأسبوع التاسع!", contentEn: "Structures group related variables of different types under one name.", contentAr: "الهياكل تجمع المتغيرات المرتبطة من أنواع مختلفة تحت اسم واحد." },
        { type: "code", titleEn: "Structure Definition", titleAr: "تعريف الهيكل", code: `#include <iostream>
#include <string>
using namespace std;

struct Student {
    string name;
    int id;
    double gpa;
};

int main() {
    Student s1;
    s1.name = "Ahmed";
    s1.id = 12345;
    s1.gpa = 3.75;
    
    cout << "Name: " << s1.name << endl;
    cout << "ID: " << s1.id << endl;
    cout << "GPA: " << s1.gpa << endl;
    
    return 0;
}`, explanation: "struct groups different data types. Access members using dot operator.", explanationAr: "struct تجمع أنواع بيانات مختلفة. الوصول للأعضاء باستخدام عامل النقطة." },
        { type: "code", titleEn: "Array of Structures", titleAr: "مصفوفة من الهياكل", code: `struct Student {
    string name;
    int id;
    double gpa;
};

int main() {
    Student students[3];
    
    // Input
    for (int i = 0; i < 3; i++) {
        cout << "Enter name: ";
        cin >> students[i].name;
        cout << "Enter ID: ";
        cin >> students[i].id;
        cout << "Enter GPA: ";
        cin >> students[i].gpa;
    }
    
    // Display
    for (int i = 0; i < 3; i++) {
        cout << students[i].name << " - " 
             << students[i].gpa << endl;
    }
}`, explanation: "Array of structs allows storing multiple records.", explanationAr: "مصفوفة من الهياكل تسمح بتخزين سجلات متعددة." }
      ],
      exercises: [
        { q: "struct is used to:", qAr: "struct تستخدم لـ:", options: ["Store one value", "Group different data types", "Create loops", "Define functions"], correct: 1 },
        { q: "Access struct members using:", qAr: "الوصول لأعضاء struct باستخدام:", options: ["->", ".", "::", "[]"], correct: 1 },
        { q: "struct can contain:", qAr: "struct يمكن أن تحتوي:", options: ["Only int", "Only same types", "Different types", "Only strings"], correct: 2 },
        { q: "struct variables are called:", qAr: "متغيرات struct تسمى:", options: ["Objects", "Members", "Functions", "Classes"], correct: 1 },
        { q: "Array of struct allows:", qAr: "مصفوفة من struct تسمح بـ:", options: ["One record", "Multiple records", "No records", "Only numbers"], correct: 1 }
      ]
    },
    10: {
      titleEn: "Intro to OOP",
      titleAr: "مقدمة في OOP",
      icon: "🎯",
      video: { title: "Introduction to OOP", titleAr: "مقدمة في البرمجة الشيئية", youtubeId: "wN0x9eZLix4", description: "Learn classes, objects, and basic OOP concepts." },
      content: [
        { type: "intro", titleEn: "Welcome to Week 10!", titleAr: "مرحباً بك في الأسبوع العاشر!", contentEn: "Object-Oriented Programming organizes code into classes and objects for better structure and reusability.", contentAr: "البرمجة الشيئية تنظم الكود في فئات وكائنات لهيكل أفضل وإعادة استخدام." },
        { type: "concept", titleEn: "Class vs Structure", titleAr: "الفرق بين Class و Structure", contentEn: "Classes are similar to structs but with more features.", contentAr: "الفئات مشابهة للهياكل لكن بمميزات أكثر.", keyPoints: [
          { en: "struct: Members public by default", ar: "struct: الأعضاء عامة افتراضياً" },
          { en: "class: Members private by default", ar: "class: الأعضاء خاصة افتراضياً" },
          { en: "class supports encapsulation better", ar: "class تدعم التغليف بشكل أفضل" }
        ]},
        { type: "code", titleEn: "Creating a Class", titleAr: "إنشاء فئة", code: `class Student {
private:
    string name;
    int id;
    
public:
    // Setter
    void setName(string n) {
        name = n;
    }
    
    void setId(int i) {
        id = i;
    }
    
    // Getter
    string getName() {
        return name;
    }
    
    void display() {
        cout << "Name: " << name << endl;
        cout << "ID: " << id << endl;
    }
};

int main() {
    Student s1;
    s1.setName("Ahmed");
    s1.setId(12345);
    s1.display();
    return 0;
}`, explanation: "Classes use private data with public getter/setter methods for encapsulation.", explanationAr: "الفئات تستخدم بيانات خاصة مع طرق getter/setter عامة للتغليف." },
        { type: "code", titleEn: "Constructor", titleAr: "المُنشئ", code: `class Rectangle {
private:
    int length, width;
    
public:
    // Constructor
    Rectangle(int l, int w) {
        length = l;
        width = w;
    }
    
    int area() {
        return length * width;
    }
};

int main() {
    Rectangle r1(10, 5);
    cout << "Area: " << r1.area();  // 50
    return 0;
}`, explanation: "Constructor initializes object when created. Has same name as class.", explanationAr: "المُنشئ يهيئ الكائن عند إنشائه. له نفس اسم الفئة." }
      ],
      exercises: [
        { q: "class members are by default:", qAr: "أعضاء class افتراضياً:", options: ["public", "private", "protected", "static"], correct: 1 },
        { q: "struct members are by default:", qAr: "أعضاء struct افتراضياً:", options: ["private", "public", "protected", "const"], correct: 1 },
        { q: "Encapsulation means:", qAr: "التغليف يعني:", options: ["Hiding data", "Creating loops", "Using arrays", "Sorting data"], correct: 0 },
        { q: "Constructor has:", qAr: "المُنشئ لديه:", options: ["Return type", "No return type", "Only void", "Only int"], correct: 1 },
        { q: "Object is:", qAr: "الكائن هو:", options: ["A class", "Instance of class", "A function", "A variable"], correct: 1 }
      ]
    }
  };

  const week = weekData[weekNum];
  if (!week) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Week {weekNum} not found</h1>
          <button onClick={() => onNavigate('home')} className="px-6 py-3 bg-cyan-600 text-white rounded-lg">Back to Home</button>
        </div>
      </div>
    );
  }

  const totalSteps = week.content.length + 1;
  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  const handleAnswer = (qIndex, optIndex) => { if (!submitted) setAnswers({ ...answers, [qIndex]: optIndex }); };

  const handleSubmit = () => {
    setSubmitted(true);
    const correct = week.exercises.filter((ex, i) => answers[i] === ex.correct).length;
    const score = Math.round((correct / week.exercises.length) * 100);
    onExerciseComplete(weekNum, score);
  };

  const renderContent = (item, index) => {
    if (item.type === 'intro') {
      return (<div key={index} className="bg-gradient-to-r from-cyan-900/50 to-slate-800/50 rounded-2xl p-8 border border-cyan-500/30"><h2 className="text-2xl font-bold text-white mb-2">{item.titleEn}</h2><p className="text-cyan-300/70 font-arabic mb-4">{item.titleAr}</p><p className="text-slate-300 mb-2">{item.contentEn}</p><p className="text-cyan-300/70 font-arabic">{item.contentAr}</p></div>);
    }
    if (item.type === 'concept') {
      return (<div key={index} className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700"><h3 className="text-xl font-bold text-white mb-2">{item.titleEn}</h3><p className="text-cyan-300/70 font-arabic mb-4">{item.titleAr}</p><p className="text-slate-300 mb-2">{item.contentEn}</p><p className="text-cyan-300/70 font-arabic mb-4">{item.contentAr}</p>{item.keyPoints && (<ul className="space-y-2">{item.keyPoints.map((point, i) => (<li key={i} className="flex items-start gap-2"><span className="text-cyan-400 mt-1">•</span><div><span className="text-white">{point.en}</span><span className="text-cyan-300/70 font-arabic block text-sm">{point.ar}</span></div></li>))}</ul>)}</div>);
    }
    if (item.type === 'code') {
      return (<div key={index} className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700"><h3 className="text-xl font-bold text-white mb-2">{item.titleEn}</h3><p className="text-cyan-300/70 font-arabic mb-4">{item.titleAr}</p><pre className="bg-slate-900 rounded-xl p-4 overflow-x-auto mb-4"><code className="text-cyan-400 text-sm">{item.code}</code></pre><p className="text-slate-300 text-sm">{item.explanation}</p><p className="text-cyan-300/70 font-arabic text-sm">{item.explanationAr}</p></div>);
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900/30">
      <header className="bg-slate-800/80 backdrop-blur border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button onClick={() => onNavigate('home')} className="flex items-center gap-2 text-slate-400 hover:text-white"><span>←</span> Back</button>
            <div className="text-center"><h1 className="text-white font-bold text-sm">Week {weekNum}</h1><p className="text-cyan-300/70 text-xs">{week.titleEn}</p></div>
            <button onClick={onLogout} className="text-red-400 text-sm">Logout</button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-slate-400 mb-2"><span>Step {currentStep + 1} of {totalSteps}</span><span>{progressPercent}% Complete</span></div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all" style={{ width: `${progressPercent}%` }} /></div>
        </div>

        {currentStep === 0 && week.video && (
          <div className="bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700 mb-8">
            <div className="aspect-video"><iframe className="w-full h-full" src={`https://www.youtube.com/embed/${week.video.youtubeId}`} title={week.video.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div>
            <div className="p-6"><h2 className="text-xl font-bold text-white mb-1">{week.video.title}</h2><p className="text-cyan-300/70 font-arabic mb-2">{week.video.titleAr}</p><p className="text-slate-400 text-sm">{week.video.description}</p></div>
          </div>
        )}

        {currentStep > 0 && currentStep <= week.content.length && (<div className="mb-8">{renderContent(week.content[currentStep - 1], currentStep - 1)}</div>)}

        {showExercise && (
          <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Exercise | تمرين</h2>
            <div className="space-y-6">
              {week.exercises.map((ex, qIndex) => (
                <div key={qIndex} className="bg-slate-700/30 rounded-xl p-6">
                  <p className="text-white font-medium mb-1">{qIndex + 1}. {ex.q}</p>
                  <p className="text-cyan-300/70 font-arabic text-sm mb-4">{ex.qAr}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {ex.options.map((opt, optIndex) => {
                      const isSelected = answers[qIndex] === optIndex;
                      const isCorrect = ex.correct === optIndex;
                      let btnClass = 'p-3 rounded-lg border text-left transition-all ';
                      if (submitted) {
                        if (isCorrect) btnClass += 'bg-cyan-600/30 border-cyan-500 text-cyan-300';
                        else if (isSelected && !isCorrect) btnClass += 'bg-red-600/30 border-red-500 text-red-300';
                        else btnClass += 'bg-slate-700/50 border-slate-600 text-slate-400';
                      } else {
                        btnClass += isSelected ? 'bg-cyan-600/30 border-cyan-500 text-white' : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:border-cyan-500/50';
                      }
                      return (<button key={optIndex} onClick={() => handleAnswer(qIndex, optIndex)} className={btnClass} disabled={submitted}>{opt}</button>);
                    })}
                  </div>
                </div>
              ))}
            </div>
            {!submitted ? (
              <button onClick={handleSubmit} disabled={Object.keys(answers).length < week.exercises.length} className="mt-6 w-full py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold rounded-lg">Submit Answers | إرسال الإجابات</button>
            ) : (
              <div className="mt-6 text-center">
                <div className="text-4xl font-bold text-cyan-400 mb-2">{Math.round((week.exercises.filter((ex, i) => answers[i] === ex.correct).length / week.exercises.length) * 100)}%</div>
                <p className="text-slate-400">{week.exercises.filter((ex, i) => answers[i] === ex.correct).length} / {week.exercises.length} correct</p>
                <button onClick={() => onNavigate('home')} className="mt-4 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg">Back to Course | العودة للدورة</button>
              </div>
            )}
          </div>
        )}

        {!showExercise && (
          <div className="flex items-center justify-between">
            <button onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0} className="px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg">← Previous</button>
            {currentStep < week.content.length ? (
              <button onClick={() => setCurrentStep(currentStep + 1)} className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg">Next →</button>
            ) : (
              <button onClick={() => setShowExercise(true)} className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg">Start Exercise | بدء التمرين</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeekLesson;
