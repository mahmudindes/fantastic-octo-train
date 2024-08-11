package utila

import "regexp"

var ValidUsername = regexp.MustCompile("^[.0-9A-Za-z]*$").MatchString
