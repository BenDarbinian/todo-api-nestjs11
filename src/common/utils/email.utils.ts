export class EmailUtils {
  /**
   * Mapping of commonly misspelled domains to their correct versions.
   * Includes popular providers like Gmail, Yahoo, Outlook, Yandex, Mail.ru, etc.
   */
  private static readonly DOMAIN_CORRECTIONS: Record<string, string> = {
    'gmail.ru': 'gmail.com',
    'jmail.com': 'gmail.com',
    'gnail.com': 'gmail.com',
    'gamil.com': 'gmail.com',
    'gmal.com': 'gmail.com',
    'gmai.com': 'gmail.com',
    'gvail.com': 'gmail.com',
    'gail.com': 'gmail.com',
    'qmail.com': 'gmail.com',
    'bmail.com': 'gmail.com',
    'hmail.com': 'gmail.com',
    'gmeil.com': 'gmail.com',
    'gmal.ru': 'gmail.com',

    'yahooo.com': 'yahoo.com',
    'yahhoo.com': 'yahoo.com',
    'yhaoo.com': 'yahoo.com',

    'hotmail.co': 'hotmail.com',
    'hotmal.com': 'hotmail.com',
    'hotmaul.com': 'hotmail.com',

    'outlok.com': 'outlook.com',
    'outllok.com': 'outlook.com',
    'outlokk.com': 'outlook.com',

    'aol.co': 'aol.com',
    'live.cm': 'live.com',
    'live.ru': 'live.com',

    'icloud.co': 'icloud.com',
    'icloud.ru': 'icloud.com',

    'zoho.co': 'zoho.com',

    'yandx.ru': 'yandex.ru',
    'yandeks.ru': 'yandex.ru',
    'yandxk.ru': 'yandex.ru',
    'yandxk.com': 'yandex.ru',
    'yandex.co': 'yandex.ru',
    'yaa.ru': 'ya.ru',
    'yanbex.ru': 'yandex.ru',
    'uandex.ru': 'yandex.ru',
    'yadex.ru': 'yandex.ru',
    'eandex.ru': 'yandex.ru',
    'iandex.ru': 'yandex.ru',
    'jandex.ru': 'yandex.ru',
    'yandekx.ru': 'yandex.ru',
    'yahdex.ru': 'yandex.ru',
    'yqndex.ru': 'yandex.ru',

    'maii.ru': 'mail.ru',
    'mael.ru': 'mail.ru',
    'meil.ru': 'mail.ru',
    'maile.ru': 'mail.ru',
    'maiil.ru': 'mail.ru',
    'mial.ru': 'mail.ru',
    'vail.ru': 'mail.ru',

    'rambler.co': 'rambler.ru',
    'rambleru.ru': 'rambler.ru',
    'ramler.ru': 'rambler.ru',
    'bambler.ru': 'rambler.ru',
    'ramrler.ru': 'rambler.ru',
    'rambker.ru': 'rambler.ru',
    'ramdler.ru': 'rambler.ru',
    'gambler.ru': 'rambler.ru',
    'rfmbler.ru': 'rambler.ru',

    'bk.co': 'bk.ru',
    'inboxu.ru': 'inbox.ru',
    'inboxc.ru': 'inbox.ru',
    'inboxk.ru': 'inbox.ru',
    'indox.ru': 'inbox.ru',
    'invox.ru': 'inbox.ru',
    'ibnox.ru': 'inbox.ru',

    'zmail.co': 'zmail.ru',
    'qip.co': 'qip.ru',
    'sputnik.co': 'sputnik.ru',
  };

  /**
   * Mapping of commonly mistyped top-level zones (TLDs) to correct ones.
   */
  private static readonly ZONE_CORRECTIONS: Record<string, string> = {
    '.cmo': '.com',
    '.comm': '.com',
    '.comn': '.com',
    '.con': '.com',
    '.conm': '.com',
    '.r': '.ru',
    '.ru.ru': '.ru',
    '.ruu': '.ru',
  };

  /**
   * Corrects common typos in an email address.
   *
   * @param email - The input email string
   * @returns The corrected email, or original if no correction was found
   * @throws Error if email is null, undefined, or empty string
   *
   * @example
   * EmailUtils.correct('user@gmai.cmo') → 'user@gmail.com'
   * EmailUtils.correct('admin@yandxk.ru') → 'admin@yandex.ru'
   */
  static correct(email: string): string {
    if (!email) {
      return email;
    }

    const atIndex = email.lastIndexOf('@');
    if (atIndex === -1) {
      return email; // No @ → invalid format, but return as-is for validator to handle
    }

    const localPart = email.substring(0, atIndex);
    let domain = email.substring(atIndex + 1).toLowerCase();

    // Step 1: Fix common TLD (zone) typos like .cmo → .com
    domain = this.fixZoneTypos(domain);

    // Step 2: Fix full domain typos like gmai.com → gmail.com
    domain = this.DOMAIN_CORRECTIONS[domain] || domain;

    return `${localPart}@${domain}`;
  }

  /**
   * Attempts to fix common TLD/zone typos in the domain part.
   *
   * @param domain - The domain part of the email (after @)
   * @returns Corrected domain if a zone typo was found, otherwise unchanged
   */
  private static fixZoneTypos(domain: string): string {
    for (const [incorrect, correct] of Object.entries(this.ZONE_CORRECTIONS)) {
      if (domain.endsWith(incorrect)) {
        return domain.slice(0, -incorrect.length) + correct;
      }
    }
    return domain;
  }
}
