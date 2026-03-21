# FLUX Team Management Feature

## Overview
The FLUX Team Management feature allows admins to assign official roles to members and display them as the leadership team on the website. This includes officers like President, Vice President, Faculty Advisors, and committee leads like Figma Friday Lead, Yearbook Committee Lead, etc.

---

## ✅ What Was Implemented

### 1. Database Schema (Already Existed)
The members table already had the necessary fields:
- `is_flux_team` (BOOLEAN) - Marks if a member is on the FLUX team
- `flux_team_role` (TEXT) - Stores their specific role

**No database changes were needed!** The schema was already prepared for this feature.

---

### 2. Service Function
**File:** `/src/services/members.js`

**New Function:**
```javascript
updateFluxTeamStatus(memberId, isFluxTeam, fluxTeamRole)
```

**What it does:**
- Updates a member's FLUX team status
- Sets or removes their role
- Returns the updated member data

**Parameters:**
- `memberId` (string) - UUID of the member
- `isFluxTeam` (boolean) - Whether they're on the FLUX team
- `fluxTeamRole` (string|null) - Their role (or null if removed)

---

### 3. Admin Panel UI
**File:** `/src/pages/Admin.jsx`

**New Features:**

#### 3.1 View Selector
Added toggle buttons in the Members tab:
- **Applications** - Manage member applications (existing functionality)
- **FLUX Team** - Manage FLUX team members (new!)

#### 3.2 FLUX Team Management View
When "FLUX Team" is selected, you see:

**Current FLUX Team Members Section:**
- Shows all members currently on the FLUX team
- Displays their photo, name, and assigned role
- Two action buttons per member:
  - **Edit Role** (Orange) - Change their role
  - **Remove** (Red) - Remove them from FLUX team

**Available Members Section:**
- Shows all members NOT on the FLUX team
- Grid layout with member cards
- Each card shows: photo, name, year, campus
- **"Add to FLUX Team"** button on each card

#### 3.3 Role Assignment Modal
Popup modal when adding/editing a member:
- Shows member name
- Dropdown with pre-defined roles:
  - President
  - Vice President
  - Secretary
  - Treasurer
  - Faculty Advisor
  - Figma Friday Lead
  - Yearbook Committee Lead
  - Events Coordinator
  - Marketing Lead
  - Social Media Manager
  - Workshop Coordinator
  - Community Manager
- Text input for custom roles
- Save/Cancel buttons

---

## 🎯 How to Use (Admin Instructions)

### Adding a Member to FLUX Team

1. **Navigate to Admin Panel**
   - Login with admin password
   - Click on "Manage Applications" tab

2. **Switch to FLUX Team View**
   - Click the "FLUX Team" button at the top

3. **Add a Member**
   - Scroll down to "Available Members"
   - Find the member you want to add
   - Click "Add to FLUX Team" button

4. **Assign Role**
   - Modal popup will appear
   - Select a pre-defined role from dropdown, OR
   - Type a custom role in the text input
   - Click "Save"

5. **Confirmation**
   - Alert will show "FLUX team status updated successfully!"
   - Member will now appear in "Current FLUX Team Members" section

---

### Editing a Member's Role

1. Go to FLUX Team view
2. Find the member in "Current FLUX Team Members"
3. Click "Edit Role" button (orange)
4. Change their role in the modal
5. Click "Save"

---

### Removing a Member from FLUX Team

1. Go to FLUX Team view
2. Find the member in "Current FLUX Team Members"
3. Click "Remove" button (red)
4. Confirm the action
5. Member moves back to "Available Members"

---

## 🎨 UI Design Details

### View Selector
- Clean toggle buttons
- Active state: Blue background (#316EFF) with shadow
- Inactive state: White with gray border
- Space Grotesk font

### Current FLUX Team Cards
- **Layout:** 2-column grid (1 column on mobile)
- **Style:** White background, blue border (#316EFF), shadow
- **Photo:** 64x64px circular, gradient fallback with initial
- **Role:** Blue text (#316EFF), semi-bold
- **Buttons:** Orange (Edit), Red (Remove)

### Available Members Cards
- **Layout:** 3-column grid (responsive)
- **Style:** White background, gray border, hover effect
- **Photo:** 48x48px circular
- **Info:** Name, year, campus
- **Button:** Full-width blue button

### Role Assignment Modal
- **Background:** Semi-transparent black overlay
- **Modal:** White, rounded corners (32px)
- **Max-width:** 28rem (448px)
- **Dropdown:** 12 pre-defined roles
- **Custom Input:** Below dropdown for custom roles
- **Buttons:** Cancel (gray), Save (blue)

---

## 🔧 Technical Implementation

### State Management
```javascript
const [memberView, setMemberView] = useState('applications');
const [editingFluxTeamMember, setEditingFluxTeamMember] = useState(null);
const [fluxTeamRole, setFluxTeamRole] = useState('');
```

### Data Fetching
Members are fetched when:
- In Members tab AND FLUX Team view is selected
- OR when in Events tab (for presenter dropdown)

```javascript
enabled: isUnlocked && (activeTab === 'events' || (activeTab === 'members' && memberView === 'flux-team'))
```

### Mutations
```javascript
const fluxTeamMutation = useMutation({
  mutationFn: ({ memberId, isFluxTeam, role }) =>
    updateFluxTeamStatus(memberId, isFluxTeam, role),
  onSuccess: async () => {
    // Invalidate members query
    // Close modal
    // Show success alert
  }
});
```

### Event Handlers
- `handleAddToFluxTeam(member)` - Opens modal with member data
- `handleRemoveFromFluxTeam(member)` - Confirms and removes
- `handleSaveFluxTeamRole()` - Validates and saves role

---

## 📝 Testing Checklist

### Before User Testing:
- [x] FLUX Team tab appears in Members section
- [x] Can switch between Applications and FLUX Team views
- [x] Members list loads correctly
- [x] Can add a member to FLUX team
- [x] Role assignment modal opens
- [x] Can select predefined roles from dropdown
- [x] Can enter custom roles
- [x] Save button works
- [x] Cancel button closes modal
- [x] Can edit existing member's role
- [x] Can remove member from FLUX team
- [x] Refresh button works
- [x] No console errors
- [x] Dev server runs cleanly

### For User to Test:
- [ ] Add a member with role "President"
- [ ] Add multiple members with different roles
- [ ] Edit a member's role
- [ ] Remove a member from FLUX team
- [ ] Try custom role (e.g., "Design Lead")
- [ ] Verify members appear/disappear correctly
- [ ] Check that it persists after refresh

---

## 🚀 Next Steps (Optional Enhancements)

### Display FLUX Team on Public Page
Create a public-facing "Team" or "About" page that shows:
- FLUX team members with their roles
- Photos and bios
- Grouped by role type (Officers, Committee Leads, etc.)

**Suggested Implementation:**
```javascript
// In a new page component
const { data: fluxTeam } = useQuery({
  queryKey: ['flux-team'],
  queryFn: () => fetchMembers({ isFluxTeam: true })
});

// Display them in a grid
// Group by role category
// Show contact info (optional)
```

### Role Categories
Add a field for role category to group team members:
- **Officers** - President, VP, Secretary, Treasurer
- **Advisors** - Faculty Advisor
- **Committees** - Figma Friday Lead, Yearbook Lead, etc.
- **Coordinators** - Events, Marketing, etc.

### Sort Order
Add a `display_order` field to control how team members appear:
- Allow drag-and-drop reordering in admin panel
- Save order to database
- Display in that order on public page

---

## 🎨 Design System

All UI follows FLUX design system:
- **Primary Color:** #316EFF (FLUX Blue)
- **Font:** Space Grotesk
- **Border Radius:** 12px (small), 20px (medium), 24px (large), 32px (extra large)
- **Spacing:** Consistent padding and gaps
- **Shadows:** Subtle on hover, elevated on active
- **Transitions:** Smooth scale and color changes

---

## 🐛 Troubleshooting

### Members Not Showing Up
**Issue:** Available members list is empty
**Solution:**
1. Make sure you have approved members
2. Check that you're in the FLUX Team view
3. Click Refresh button
4. Check browser console for errors

### Role Not Saving
**Issue:** Role assignment doesn't work
**Solution:**
1. Make sure you entered a role (required field)
2. Check that the member ID is valid
3. Verify admin permissions
4. Check network tab for failed requests

### Modal Won't Close
**Issue:** Modal stuck open
**Solution:**
1. Click Cancel button
2. Refresh the page
3. Check console for JavaScript errors

---

## 📊 Database Queries

### Fetch All Members
```sql
SELECT * FROM members
WHERE is_active = true
ORDER BY created_at DESC;
```

### Fetch FLUX Team Only
```sql
SELECT * FROM members
WHERE is_active = true
AND is_flux_team = true
ORDER BY created_at DESC;
```

### Update Member to FLUX Team
```sql
UPDATE members
SET
  is_flux_team = true,
  flux_team_role = 'President'
WHERE id = 'member-uuid';
```

### Remove from FLUX Team
```sql
UPDATE members
SET
  is_flux_team = false,
  flux_team_role = NULL
WHERE id = 'member-uuid';
```

---

## ✨ Summary

**What You Can Do Now:**
✅ Assign members to FLUX team from Admin Panel
✅ Give them specific roles (President, VP, etc.)
✅ Edit roles anytime
✅ Remove members from team
✅ Use predefined OR custom roles
✅ Clean, intuitive UI

**Files Modified:**
- `/src/services/members.js` - Added `updateFluxTeamStatus()` function
- `/src/pages/Admin.jsx` - Added FLUX Team management UI

**Database:**
- No changes needed! Schema already supported this feature

**Testing Status:**
- ✅ Feature implemented
- ✅ No compilation errors
- ✅ Dev server running cleanly
- ⏳ Ready for user testing

---

## 📞 Support

If you encounter any issues:
1. Check browser console for errors
2. Verify member exists and is approved
3. Try refreshing the page
4. Check that role field is not empty
5. Report any bugs to development team

**Happy Team Building! 🚀**
