package utila

import "slices"

func SlicesDelete[S ~[]E, E comparable](s S, v E) S {
	for i, r := range s {
		if r != v {
			continue
		}
		s = slices.Delete(s, i, i+1)
	}
	return s
}
