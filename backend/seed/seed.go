package seed

import (
	"log"

	"codecrafted/portfolio/config"

	"github.com/lib/pq"
)

func SeedData() {
	// Check if articles table has data
	var articleCount int
	err := config.DB.QueryRow("SELECT COUNT(*) FROM articles").Scan(&articleCount)
	if err != nil {
		log.Printf("Failed to count articles: %v", err)
		return
	}

	if articleCount == 0 {
		seedArticles()
	}

	// Check if snippets table has data
	var snippetCount int
	err = config.DB.QueryRow("SELECT COUNT(*) FROM snippets").Scan(&snippetCount)
	if err != nil {
		log.Printf("Failed to count snippets: %v", err)
		return
	}

	if snippetCount == 0 {
		seedSnippets()
	}
}

func seedArticles() {
	articles := []struct {
		Title    string
		Content  string
		Excerpt  string
		Tags     []string
		ReadTime int
	}{
		{
			Title: "Understanding Async Patterns in Modern JavaScript",
			Content: `Asynchronous programming is a fundamental concept in modern JavaScript development. With the introduction of Promises and async/await syntax, handling asynchronous operations has become more intuitive and manageable.

## Promises: The Foundation

A Promise represents a value that may not be available yet but will be resolved at some point in the future. It can be in one of three states: pending, fulfilled, or rejected.

\` + "```javascript\nconst fetchData = () => {\n  return new Promise((resolve, reject) => {\n    setTimeout(() => {\n      resolve({ data: 'Hello World' });\n    }, 1000);\n  });\n};\n```" + `

## Async/Await: Syntactic Sugar

The async/await pattern provides a cleaner way to work with Promises. An async function automatically wraps its return value in a Promise, and the await keyword pauses execution until the Promise resolves.

\` + "```javascript\nasync function getData() {\n  try {\n    const response = await fetchData();\n    console.log(response.data);\n  } catch (error) {\n    console.error('Error:', error);\n  }\n}\n```" + `

## Error Handling

Proper error handling is crucial in asynchronous code. Using try/catch blocks with async/await makes error handling straightforward and readable.

## Conclusion

Understanding async patterns is essential for building responsive, performant applications. Whether you're working with API calls, file operations, or user interactions, mastering these patterns will elevate your JavaScript development skills.`,
			Excerpt:  "A deep dive into promises, async/await, and how to handle asynchronous operations elegantly in your applications.",
			Tags:     []string{"JavaScript", "Async", "Programming"},
			ReadTime: 5,
		},
		{
			Title: "Building Scalable APIs with Go and Gin",
			Content: `Go has emerged as a powerful language for building backend services, and the Gin framework makes it even easier to create high-performance REST APIs.

## Why Go for APIs?

Go's concurrency model, fast compilation, and strong standard library make it an excellent choice for building web services. Combined with Gin's minimal overhead, you get APIs that can handle thousands of requests per second.

## Setting Up Your Project

Start by initializing a Go module and installing Gin. The project structure should separate concerns into handlers, models, and middleware.

## Middleware and Authentication

Implementing middleware in Gin is straightforward. You can create custom middleware for logging, authentication, rate limiting, and more.

## Conclusion

Go and Gin provide a robust foundation for building scalable APIs. The combination of Go's performance and Gin's developer-friendly API makes it ideal for production-ready services.`,
			Excerpt:  "Explore the power of Go and the Gin framework for creating high-performance, scalable REST APIs with clean architecture.",
			Tags:     []string{"Go", "API", "Backend"},
			ReadTime: 7,
		},
		{
			Title: "The Art of Clean Code: Principles Every Developer Should Know",
			Content: `Writing clean code is not just about making code work—it's about making code that can be understood, maintained, and extended by others (including your future self).

## Meaningful Names

Variables, functions, and classes should have names that reveal their purpose. Avoid abbreviations and cryptic names.

## Small Functions

Functions should do one thing, do it well, and do it only. If a function is doing multiple things, break it down into smaller, focused functions.

## DRY Principle

Don't Repeat Yourself. Every piece of knowledge should have a single, unambiguous representation within a system.

## Comments

Good code is self-documenting. Use comments to explain "why," not "what." If you need to explain what the code does, the code should be refactored to be clearer.

## Conclusion

Clean code is a discipline that takes practice and dedication. By following these principles consistently, you create code that stands the test of time.`,
			Excerpt:  "Master the fundamental principles of writing clean, maintainable code that stands the test of time and team changes.",
			Tags:     []string{"Clean Code", "Best Practices", "Software Engineering"},
			ReadTime: 6,
		},
	}

	for _, a := range articles {
		_, err := config.DB.Exec(
			`INSERT INTO articles (title, content, excerpt, tags, read_time, publish_date) 
			 VALUES ($1, $2, $3, $4, $5, NOW() - interval '1 day' * (random() * 30)::int)`,
			a.Title, a.Content, a.Excerpt, pq.Array(a.Tags), a.ReadTime)
		if err != nil {
			log.Printf("Failed to seed article: %v", err)
		}
	}
	log.Println("Sample articles seeded successfully")
}

func seedSnippets() {
	snippets := []struct {
		Title       string
		Code        string
		Language    string
		Description string
	}{
		{
			Title: "Debounce Function",
			Code: `function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// Usage
const handleSearch = debounce((query) => {
  console.log('Searching for:', query);
  // API call here
}, 300);`,
			Language:    "JavaScript",
			Description: "A utility function that limits the rate at which a function can fire. Essential for optimizing search inputs, scroll handlers, and resize events.",
		},
		{
			Title: "Custom Hook - useLocalStorage",
			Code: `import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// Usage
// const [theme, setTheme] = useLocalStorage('theme', 'dark');`,
			Language:    "React",
			Description: "A custom React hook that syncs state with localStorage, providing persistent state across browser sessions with automatic serialization.",
		},
		{
			Title: "Generic HTTP Client",
			Code: `package httpclient

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type Client struct {
	BaseURL    string
	HTTPClient *http.Client
}

func NewClient(baseURL string) *Client {
	return &Client{
		BaseURL: baseURL,
		HTTPClient: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

func (c *Client) Get(path string, result interface{}) error {
	resp, err := c.HTTPClient.Get(c.BaseURL + path)
	if err != nil {
		return fmt.Errorf("request failed: %w", err)
	}
	defer resp.Body.Close()
	return json.NewDecoder(resp.Body).Decode(result)
}`,
			Language:    "Go",
			Description: "A reusable HTTP client wrapper in Go with timeout configuration, base URL support, and JSON response decoding for clean API consumption.",
		},
	}

	for _, s := range snippets {
		_, err := config.DB.Exec(
			`INSERT INTO snippets (title, code, language, description, created_at) 
			 VALUES ($1, $2, $3, $4, NOW() - interval '1 day' * (random() * 15)::int)`,
			s.Title, s.Code, s.Language, s.Description)
		if err != nil {
			log.Printf("Failed to seed snippet: %v", err)
		}
	}
	log.Println("Sample snippets seeded successfully")
}
