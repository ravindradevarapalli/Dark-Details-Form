# build togo list application

i want to build a simple command line application in go that manages a togo list

## Features

- add a new togo item
- list all togo items
- mark a togo item as done
- delete a togo item
- save togo list to a file
- load togo list from a file

## Usage

- `togo add "item description"`: adds a new togo item with the given description
- `togo list`: lists all togo items with their status (done or not done)
- `togo done <item id>`: marks the togo item with the given id as done
- `togo delete <item id>`: deletes the togo item with the given id
- `togo save`: saves the togo list to a file
- `togo load`: loads the togo list from a file

## Examples

- `togo add "Buy groceries"`: adds a new togo item with the description "Buy groceries"
- `togo list`: lists all togo items with their status (done or not done)
- `togo done 1`: marks the togo item with id 1 as done
- `togo delete 2`: deletes the togo item with id 2
- `togo save`: saves the togo list to a file
- `togo load`: loads the togo list from a file

## Implementation

- use a struct to represent a togo item with fields for id, description, and status (done or not done)
- use a slice to store the togo items
- use the "encoding/json" package to save and load the togo list to/from a file in JSON format
- use the "flag" package to parse command line arguments
- implement functions for each feature (add, list, done, delete, save, load)
- use a switch statement to handle different commands based on the first command line argument
- handle errors appropriately (e.g., invalid item id, file not found)

## Dependencies

- "encoding/json"
- "flag"
- "fmt"
- "os"
- "strconv"
- "io/ioutil"
- "errors"

## License

- MIT
-

## Author

- Your Name Here
- Date: June 2024
- Email: yourname@example.com
- GitHub:
- Twitter:
- LinkedIn:
- Website:
- https://yourwebsite.com
- Feel free to modify and enhance the application as per your requirements!
- Happy coding!
- MIT License
- Permission is hereby granted, free of charge, to any person obtaining a copy
- of this software and associated documentation files (the "Software"), to deal
- in the Software without restriction, including without limitation the rights
- to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
- copies of the Software, and to permit persons to whom the Software is
- furnished to do so, subject to the following conditions:
- The above copyright notice and this permission notice shall be included in all
- copies or substantial portions of the Software.
- THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
- IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
- FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
- AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
- LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
- OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
- SOFTWARE.
-
- Permission is hereby granted, free of charge, to any person obtaining a copy
- of this software and associated documentation files (the "Software"), to deal
- in the Software without restriction, including without limitation the rights
- to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
- copies of the Software, and to permit persons to whom the Software is
- furnished to do so, subject to the following conditions:
- The above copyright notice and this permission notice shall be included in all
- copies or substantial portions of the Software.
- THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
- IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
- FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
- AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
- LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
- OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
- SOFTWARE.
-
-
-       MIT License
-       ===========
-       Permission is hereby granted, free of charge, to any person obtaining a copy
-       of this software and associated documentation files (the "Software"), to deal
-       in the Software without restriction, including without limitation the rights
-       to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
-       copies of the Software, and to permit persons to whom the Software is
-       furnished to do so, subject to the following conditions:
-       The above copyright notice and this permission notice shall be included in all
-       copies or substantial portions of the Software.
-       THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
-       IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
-       FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
-       AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
-       LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
-       OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
-       SOFTWARE.
-
