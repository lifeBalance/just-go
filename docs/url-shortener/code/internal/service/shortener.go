package service

type ShortenRequest struct {
	URL string
}

type ShortenResponse struct {
	ShortCode   string
	OriginalURL string
}

type Shortener struct{}

func NewShortener() *Shortener {
	return &Shortener{}
}

func (s *Shortener) Shorten(req ShortenRequest) (ShortenResponse, error) {
	return ShortenResponse{
		ShortCode:   "stub123",
		OriginalURL: req.URL,
	}, nil
}
