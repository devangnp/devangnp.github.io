---
title: "GO XML parsing"
last_modified_at: 2021-05-09T00:00:03-05:00
categories:
  - Blog
tags:
  - - [NetOps]
---

API calls are very common while working with modern networking devices. Recently I had to work on the XML API with one of the network vendor to fetch the data for automation. XML data is good for automation as it is very easy to parse tags and use the values for different use case. 

However for the user perspective its not easy to deal with such data so there was an opportunity to learn and create XML parser to represent data in the user readable form.

In this blog post, I am documenting the experimental golang XML parsing code.

As a part of learning, I have used following XML data to parse and read out the specific field(s) and at the end we will try to pretty print using JSON format. 

```xml
        <a>
            <b>Hi</b>
            <c>How are you?</c>
            <d>Devang</d>
            <e>
                <f>Patel</f>
            </e>
            <g>
                <h>123</h>
            </g>             
        </a>
```

Example code to parse various tags:

```go
package main

import (
	"encoding/json"
	"encoding/xml"
	"fmt"
)

func main() {
    /*
	type InnerResult struct {
		Value string `xml:",innerxml"`
	}
    */

	type E struct {
		F string `xml:"f"`
	}

	type G struct {
		H string `xml:"h"`
	}

	type Result struct {
		//XMLName xml.Name `xml:"a"`
		B string `xml:"b"`
		C string `xml:"c"`
		D string `xml:"d"`
		E E      `xml:"e"`
		G G      `xml:"g"`
	}

	data := `
        <a>
            <b>Hi</b>
            <c>How are you?</c>
            <d>Devang</d>
            <e>
                <f>Patel</f>
            </e>
            <g>
                <h>123</h>
            </g>             
        </a>
	`
	v := Result{}

	err := xml.Unmarshal([]byte(data), &v)
	if err != nil {
		fmt.Printf("error: %v", err)
		return
	}
	fmt.Printf("%T\n", v)

	fmt.Println("Accessing the individual element: ", v.E.F)

	json, _ := json.MarshalIndent(v, "", "  ")
	fmt.Println(string(json))
}
```

Output:
```
 % go run panxml.go
main.Result
Accessing the individual element:  Patel
{
  "B": "Hi",
  "C": "How are you?",
  "D": "Devang",
  "E": {
    "F": "Patel"
  },
  "G": {
    "H": "123"
  }
}
```