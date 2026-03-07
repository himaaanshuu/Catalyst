# Contributing to Catalyst

Thank you for considering contributing to Catalyst! This document provides guidelines and instructions for contributing.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)

---

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors. We expect:

- Respectful communication
- Constructive feedback
- Focus on the project goals
- Acceptance of diverse perspectives

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Publishing private information
- Spam or off-topic discussions

---

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating a bug report:
1. Check existing [GitHub Issues](https://github.com/himaaanshuu/Catalyst/issues)
2. Verify the bug exists in the latest version
3. Gather relevant information (browser, OS, error messages)

**Bug Report Template:**
```markdown
**Description:** Brief description of the bug

**Steps to Reproduce:**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior:** What should happen

**Actual Behavior:** What actually happens

**Screenshots:** If applicable

**Environment:**
- Browser: [e.g., Chrome 120]
- OS: [e.g., macOS 14]
- Node version: [e.g., 18.17.0]
```

### Suggesting Features

Feature requests are welcome! Please:
1. Check if the feature is already requested
2. Describe the problem it solves
3. Provide use cases and examples
4. Consider implementation complexity

**Feature Request Template:**
```markdown
**Problem:** Describe the problem or limitation

**Proposed Solution:** How would you solve it?

**Alternatives:** Other solutions you've considered

**Use Cases:** Examples of when this would be useful

**Additional Context:** Mockups, screenshots, etc.
```

### Contributing Code

1. **Fork the repository**
2. **Create a feature branch** from `main`
3. **Make your changes** following coding standards
4. **Test thoroughly**
5. **Submit a pull request**

---

## 🛠 Development Setup

### Prerequisites

- Node.js 18+ and npm
- Git
- Supabase account
- Code editor (VS Code recommended)

### Local Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/Catalyst.git
cd Catalyst

# Add upstream remote
git remote add upstream https://github.com/himaaanshuu/Catalyst.git

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Start development server
npm run dev
```

### Database Setup

1. Create a Supabase project
2. Run `add_business_slugs.sql` in SQL Editor
3. Run `setup_rls_policies.sql` in SQL Editor
4. Update `.env.local` with your Supabase URL and key

---

## 💻 Coding Standards

### JavaScript/React Style

```javascript
// ✅ Good
const MyComponent = ({ title, onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onSubmit();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Submit'}
      </button>
    </div>
  );
};

// ❌ Bad
function MyComponent(props) {
  const [loading, setLoading] = useState(false);
  
  return <div><h1>{props.title}</h1><button onClick={() => props.onSubmit()}>Submit</button></div>;
}
```

### General Guidelines

1. **Use functional components** - No class components
2. **Destructure props** - `const { title } = props`
3. **Keep components small** - Under 300 lines ideally
4. **One component per file** - Except for small helper components
5. **Use meaningful names** - `handleSubmit` not `doStuff`
6. **Add comments** - Explain complex logic
7. **Handle errors** - Use try/catch for async operations
8. **Clean up effects** - Return cleanup functions in useEffect

### File Structure

```
src/app/
├── Feature/              # PascalCase for routes
│   └── page.js          # lowercase for Next.js convention
└── Component/           # Reusable components
    └── MyComponent.js   # PascalCase component files
```

### CSS/Tailwind

```javascript
// ✅ Good - Organized Tailwind classes
<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
  <h1 className="text-3xl font-bold text-gray-900 mb-4">Title</h1>
</div>

// ❌ Bad - Messy, hard to read
<div className="flex p-4 bg-gray-50 min-h-screen items-center flex-col justify-center">
  <h1 className="mb-4 text-gray-900 text-3xl font-bold">Title</h1>
</div>
```

### Database Queries

```javascript
// ✅ Good - Specific columns, error handling
try {
  const { data, error } = await supabase
    .from('businesses')
    .select('id, business_name, slug')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
} catch (error) {
  console.error('Error fetching businesses:', error);
  return [];
}

// ❌ Bad - Selects everything, no error handling
const { data } = await supabase
  .from('businesses')
  .select('*');
return data;
```

---

## 📝 Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

### Format
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

### Examples

```bash
# Good commits
git commit -m "feat(catalog): add product search functionality"
git commit -m "fix(auth): resolve Google OAuth redirect issue"
git commit -m "docs(readme): add troubleshooting section"
git commit -m "refactor(dashboard): simplify business card component"

# Bad commits
git commit -m "updated stuff"
git commit -m "fix bug"
git commit -m "WIP"
```

---

## 🔄 Pull Request Process

### Before Submitting

1. **Update your branch** with latest `main`:
   ```bash
   git checkout main
   git pull upstream main
   git checkout your-feature-branch
   git rebase main
   ```

2. **Run linter**:
   ```bash
   npm run lint
   ```

3. **Build successfully**:
   ```bash
   npm run build
   ```

4. **Test your changes** manually

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- Added X functionality
- Fixed Y bug
- Refactored Z component

## Testing
- [ ] Tested locally
- [ ] No console errors
- [ ] Build succeeds
- [ ] Database changes tested

## Screenshots (if applicable)
[Add screenshots here]

## Related Issues
Closes #123
```

### Review Process

1. **Maintainer reviews** your PR
2. **Address feedback** if requested
3. **Approval required** before merge
4. **Squash and merge** or rebase as appropriate

---

## 🧪 Testing Guidelines

### Manual Testing Checklist

Before submitting a PR, test:

- [ ] **Authentication** - Login/signup works
- [ ] **Business creation** - Can create new business
- [ ] **Product CRUD** - Add, edit, delete products
- [ ] **Catalog page** - Public catalog displays correctly
- [ ] **WhatsApp links** - Order buttons work
- [ ] **Mobile responsive** - Test on mobile viewport
- [ ] **Error handling** - Graceful error messages
- [ ] **Database** - No RLS policy violations

### Testing New Features

1. **Test happy path** - Everything works as expected
2. **Test edge cases** - Empty states, invalid input
3. **Test errors** - Network errors, auth errors
4. **Test different roles** - Owner vs public viewer
5. **Test mobile** - Responsive design works

---

## 🐛 Debugging Tips

### Common Issues

1. **RLS Policy Errors**
   - Check Supabase logs
   - Verify user is authenticated
   - Ensure policies are set up

2. **Build Failures**
   - Clear `.next` folder: `rm -rf .next`
   - Reinstall: `rm -rf node_modules && npm install`
   - Check for syntax errors

3. **Authentication Issues**
   - Check Supabase Auth logs
   - Verify environment variables
   - Clear browser cookies/localStorage

---

## 📞 Getting Help

- **Documentation:** Check README.md first
- **Issues:** Search existing GitHub issues
- **Discussions:** Use GitHub Discussions for questions
- **Contact:** Open an issue if stuck

---

## 🎉 Thank You!

Your contributions make Catalyst better for everyone. We appreciate your time and effort!

---

**Happy coding! 🚀**
