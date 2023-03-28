emails =
  { $unreadEmails ->
    [one] You have one unread email.
   *[other] You have { $unreadEmails } unread emails.
  }

-brand-name =
  {
   *[nominative] Firefox
    [accusative] Firefoxa
  }

-another-term = another term

app-title = { -brand-name }

restart-app = Zrestartuj { -brand-name[accusative] }.

menu-save = Save

menu-help-save = Click { menu-save } to save the file.

# Note: { $title } is a placeholder for the title of the web page
# captured in the screenshot. The default, for pages without titles, is
# creating-page-title-default.
login = Predefined value
  .placeholder = example@email.com
  .aria-label = Login input value
  .title = Type your login email

logout = Logout

today-is = Today is { DATETIME($date) }

last-notice = Last checked: { DATETIME($lastChecked, day: "numeric", month: "long") }.

