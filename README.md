A simple utility script to convert a JSON string blob into a HCL map converted with `jsonencode()`.

This is useful to capture complex JSON data structures in a Terraform template.

# Usage

```
node index.js "[{\"key\": \"Some complex JSON\"}]"
```